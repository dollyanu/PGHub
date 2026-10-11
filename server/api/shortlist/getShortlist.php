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

/* Check whether user exists */
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

/* Get shortlisted properties */
$stmt = $conn->prepare("
    SELECT
        s.id AS shortlist_id,
        s.user_id,
        s.property_id,
        s.created_at AS shortlisted_at,

        p.title,
        p.city,
        p.location,
        p.price,
        p.gender,
        p.image,
        p.description,
        p.amenities,
        p.owner_name,
        p.owner_phone,
        p.created_at

    FROM shortlist s

    INNER JOIN properties p
        ON s.property_id = p.id

    WHERE s.user_id = ?

    ORDER BY s.created_at DESC
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$shortlist = [];

while ($row = $result->fetch_assoc()) {

    /* Convert price to number */
    $row["price"] = (float) $row["price"];

    /* Convert amenities string into array */
    if (!empty($row["amenities"])) {

        $row["amenities"] = array_map(
            "trim",
            explode(",", $row["amenities"])
        );

    } else {

        $row["amenities"] = [];
    }

    $shortlist[] = $row;
}

echo json_encode([
    "success" => true,
    "message" => "Shortlist fetched successfully.",
    "count" => count($shortlist),
    "shortlist" => $shortlist
]);

$stmt->close();
$conn->close();

?>