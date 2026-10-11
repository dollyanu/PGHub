<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$booking_id = intval($_GET["id"] ?? 0);

if ($booking_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Valid booking ID is required."
    ]);

    exit();
}


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

    WHERE b.id = ?
");

$stmt->bind_param("i", $booking_id);

$stmt->execute();

$result = $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Booking not found."
    ]);

    $stmt->close();
    $conn->close();

    exit();
}


$booking = $result->fetch_assoc();

$booking["price"] = (float) $booking["price"];


if (!empty($booking["amenities"])) {

    $booking["amenities"] = array_map(
        "trim",
        explode(",", $booking["amenities"])
    );

} else {

    $booking["amenities"] = [];
}


echo json_encode([
    "success" => true,
    "message" => "Booking fetched successfully.",
    "booking" => $booking
]);


$stmt->close();
$conn->close();

?>