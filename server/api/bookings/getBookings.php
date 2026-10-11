<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$user_id = intval($_GET["user_id"] ?? 0);

if ($user_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Valid user ID is required."
    ]);

    exit();
}


// Check user
$userCheck = $conn->prepare("
    SELECT id
    FROM users
    WHERE id = ?
");

$userCheck->bind_param("i", $user_id);
$userCheck->execute();

$userResult = $userCheck->get_result();

if ($userResult->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);

    $userCheck->close();
    $conn->close();

    exit();
}

$userCheck->close();


// Get bookings
$stmt = $conn->prepare("
    SELECT
        b.id AS booking_id,
        b.user_id,
        b.property_id,
        b.booking_date,
        b.move_in_date,
        b.status,
        b.created_at,

        p.title,
        p.city,
        p.location,
        p.price,
        p.gender,
        p.image,
        p.description,
        p.amenities,
        p.owner_name,
        p.owner_phone

    FROM bookings b

    INNER JOIN properties p
        ON b.property_id = p.id

    WHERE b.user_id = ?

    ORDER BY b.created_at DESC
");

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

$bookings = [];

while ($row = $result->fetch_assoc()) {

    $row["price"] = (float) $row["price"];

    if (!empty($row["amenities"])) {

        $row["amenities"] = array_map(
            "trim",
            explode(",", $row["amenities"])
        );

    } else {

        $row["amenities"] = [];
    }

    $bookings[] = $row;
}


echo json_encode([
    "success" => true,
    "message" => "Bookings fetched successfully.",
    "count" => count($bookings),
    "bookings" => $bookings
]);


$stmt->close();
$conn->close();

?>