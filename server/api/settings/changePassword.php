<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$current_password = $data["current_password"] ?? "";
$new_password = $data["new_password"] ?? "";

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid user ID."
    ]);
    exit();
}

if (empty($current_password) || empty($new_password)) {
    echo json_encode([
        "success" => false,
        "message" => "Current and new password are required."
    ]);
    exit();
}

if (strlen($new_password) < 6) {
    echo json_encode([
        "success" => false,
        "message" => "New password must contain at least 6 characters."
    ]);
    exit();
}


// Get current password
$stmt = $conn->prepare("
    SELECT password
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


// Verify old password
if (!password_verify($current_password, $user["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Current password is incorrect."
    ]);

    exit();
}


// Hash new password
$new_password_hash = password_hash(
    $new_password,
    PASSWORD_DEFAULT
);


// Update password
$stmt = $conn->prepare("
    UPDATE users
    SET password = ?
    WHERE id = ?
");

$stmt->bind_param(
    "si",
    $new_password_hash,
    $user_id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Password changed successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to change password."
    ]);
}

$stmt->close();
$conn->close();

?>