<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {

    echo json_encode([
        "success" => false,
        "message" => "Only PUT request is allowed."
    ]);

    exit();
}


$data = json_decode(
    file_get_contents("php://input"),
    true
);

$booking_id = intval($data["booking_id"] ?? 0);
$user_id = intval($data["user_id"] ?? 0);


if ($booking_id <= 0 || $user_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Valid booking ID and user ID are required."
    ]);

    exit();
}


// Check booking belongs to user
$check = $conn->prepare("
    SELECT id, status
    FROM bookings
    WHERE id = ?
    AND user_id = ?
");

$check->bind_param(
    "ii",
    $booking_id,
    $user_id
);

$check->execute();

$result = $check->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Booking not found."
    ]);

    $check->close();
    $conn->close();

    exit();
}


$booking = $result->fetch_assoc();

$check->close();


// Already cancelled
if ($booking["status"] === "Cancelled") {

    echo json_encode([
        "success" => false,
        "message" => "Booking is already cancelled."
    ]);

    $conn->close();

    exit();
}


// Cancel booking
$stmt = $conn->prepare("
    UPDATE bookings
    SET status = 'Cancelled'
    WHERE id = ?
    AND user_id = ?
");

$stmt->bind_param(
    "ii",
    $booking_id,
    $user_id
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Booking cancelled successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to cancel booking."
    ]);
}


$stmt->close();
$conn->close();

?>