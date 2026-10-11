<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$user_id = intval($_GET["user_id"] ?? 0);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid user ID."
    ]);
    exit();
}

// Get user information
$stmt = $conn->prepare("
    SELECT id, full_name, email, phone, role
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

$user = $result->fetch_assoc();
$stmt->close();


// Check settings
$stmt = $conn->prepare("
    SELECT booking_notifications, email_notifications
    FROM user_settings
    WHERE user_id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    // Create default settings
    $booking_notifications = 1;
    $email_notifications = 1;

    $insert = $conn->prepare("
        INSERT INTO user_settings
        (user_id, booking_notifications, email_notifications)
        VALUES (?, ?, ?)
    ");

    $insert->bind_param(
        "iii",
        $user_id,
        $booking_notifications,
        $email_notifications
    );

    $insert->execute();
    $insert->close();

} else {

    $settings = $result->fetch_assoc();

    $booking_notifications =
        (int) $settings["booking_notifications"];

    $email_notifications =
        (int) $settings["email_notifications"];
}

$stmt->close();

echo json_encode([
    "success" => true,
    "message" => "Settings fetched successfully.",
    "user" => $user,
    "settings" => [
        "booking_notifications" => (bool) $booking_notifications,
        "email_notifications" => (bool) $email_notifications
    ]
]);

$conn->close();

?>