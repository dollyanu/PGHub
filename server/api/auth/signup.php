<?php

include "../../config/cors.php";
include "../../config/db.php";

// Read JSON data from React
$data = json_decode(file_get_contents("php://input"), true);

// Get form data
$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$role = trim($data["role"] ?? "student");
$password = trim($data["password"] ?? "");

// Validate required fields
if (
    empty($full_name) ||
    empty($email) ||
    empty($phone) ||
    empty($role) ||
    empty($password)
) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit();
}

// Allow only valid roles
$allowedRoles = ["student", "owner", "admin"];

if (!in_array($role, $allowedRoles)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid role selected."
    ]);
    exit();
}

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists."
    ]);
    exit();
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("
INSERT INTO users
(full_name, email, phone, role, password)
VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssss",
    $full_name,
    $email,
    $phone,
    $role,
    $hashedPassword
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Registration failed."
    ]);

}

$stmt->close();
$conn->close();

?>