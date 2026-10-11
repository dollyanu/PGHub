<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$ownerId = $data["owner_id"] ?? "";
$bookingId = $data["booking_id"] ?? "";
$status = $data["status"] ?? "";

$allowedStatuses = [
    "Pending",
    "Confirmed",
    "Cancelled"
];

if (
    !$ownerId ||
    !is_numeric($ownerId) ||
    !$bookingId ||
    !is_numeric($bookingId)
) {
    echo json_encode([
        "success" => false,
        "message" => "Valid owner and booking IDs are required."
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

$ownerId = (int) $ownerId;
$bookingId = (int) $bookingId;

try {

    $stmt = $conn->prepare("
        UPDATE bookings b

        INNER JOIN properties p
            ON b.property_id = p.id

        SET b.status = ?

        WHERE b.id = ?
        AND p.owner_id = ?
    ");

    $stmt->bind_param(
        "sii",
        $status,
        $bookingId,
        $ownerId
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Booking status updated successfully."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Booking not found or access denied."
        ]);
    }

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update booking.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>