<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed."
    ]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$property_id = intval($data["property_id"] ?? 0);
$move_in_date = trim($data["move_in_date"] ?? "");


// Validate required fields
if ($user_id <= 0 || $property_id <= 0 || empty($move_in_date)) {

    echo json_encode([
        "success" => false,
        "message" => "User ID, property ID and move-in date are required."
    ]);

    exit();
}


// Validate move-in date
$dateObject = DateTime::createFromFormat("Y-m-d", $move_in_date);

if (!$dateObject || $dateObject->format("Y-m-d") !== $move_in_date) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid move-in date. Use YYYY-MM-DD format."
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


// Check property
$propertyCheck = $conn->prepare("
    SELECT id
    FROM properties
    WHERE id = ?
");

$propertyCheck->bind_param("i", $property_id);
$propertyCheck->execute();

$propertyResult = $propertyCheck->get_result();

if ($propertyResult->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Property not found."
    ]);

    $propertyCheck->close();
    $conn->close();

    exit();
}

$propertyCheck->close();


// Check duplicate active booking
$bookingCheck = $conn->prepare("
    SELECT id
    FROM bookings
    WHERE user_id = ?
    AND property_id = ?
    AND status != 'Cancelled'
");

$bookingCheck->bind_param(
    "ii",
    $user_id,
    $property_id
);

$bookingCheck->execute();

$bookingResult = $bookingCheck->get_result();

if ($bookingResult->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "You already have an active booking for this property."
    ]);

    $bookingCheck->close();
    $conn->close();

    exit();
}

$bookingCheck->close();


// Insert booking
$stmt = $conn->prepare("
    INSERT INTO bookings
    (
        user_id,
        property_id,
        booking_date,
        move_in_date,
        status
    )
    VALUES
    (
        ?,
        ?,
        CURDATE(),
        ?,
        'Pending'
    )
");

$stmt->bind_param(
    "iis",
    $user_id,
    $property_id,
    $move_in_date
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Booking request submitted successfully.",
        "booking_id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to create booking."
    ]);
}


$stmt->close();
$conn->close();

?>