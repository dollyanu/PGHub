<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$bookingId = $data["booking_id"] ?? "";
$status = $data["status"] ?? "";

$allowedStatuses = [
    "Pending",
    "Confirmed",
    "Cancelled"
];

if (!$bookingId || !is_numeric($bookingId)) {

    echo json_encode([
        "success" => false,
        "message" => "Valid booking ID is required."
    ]);

    exit();
}

if (!in_array($status, $allowedStatuses, true)) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid booking status."
    ]);

    exit();
}

$bookingId = (int) $bookingId;

try {

    // Check booking
    $checkStmt = $conn->prepare("
        SELECT id
        FROM bookings
        WHERE id = ?
    ");

    $checkStmt->bind_param("i", $bookingId);
    $checkStmt->execute();

    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Booking not found."
        ]);

        $checkStmt->close();
        $conn->close();
        exit();
    }

    $checkStmt->close();

    // Update status
    $updateStmt = $conn->prepare("
        UPDATE bookings
        SET status = ?
        WHERE id = ?
    ");

    $updateStmt->bind_param(
        "si",
        $status,
        $bookingId
    );

    if ($updateStmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Booking status updated successfully.",
            "status" => $status
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to update booking status."
        ]);
    }

    $updateStmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Update booking failed.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>