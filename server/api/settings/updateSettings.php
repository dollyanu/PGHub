<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);

$booking_notifications =
    !empty($data["booking_notifications"]) ? 1 : 0;

$email_notifications =
    !empty($data["email_notifications"]) ? 1 : 0;

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid user ID."
    ]);
    exit();
}

// Check user
$stmt = $conn->prepare("
    SELECT id
    FROM users
    WHERE id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit();
}

$stmt->close();


// Insert or update settings
$stmt = $conn->prepare("
    INSERT INTO user_settings
    (
        user_id,
        booking_notifications,
        email_notifications
    )
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        booking_notifications = VALUES(booking_notifications),
        email_notifications = VALUES(email_notifications)
");

$stmt->bind_param(
    "iii",
    $user_id,
    $booking_notifications,
    $email_notifications
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Settings updated successfully.",
        "settings" => [
            "booking_notifications" => (bool) $booking_notifications,
            "email_notifications" => (bool) $email_notifications
        ]
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update settings."
    ]);
}

$stmt->close();
$conn->close();

?>