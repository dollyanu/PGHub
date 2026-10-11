<?php

include "../../config/cors.php";
include "../../config/db.php";

// Read JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Get email and password
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Email and Password are required."
    ]);
    exit();
}

// Check if user exists
$stmt = $conn->prepare("
    SELECT id, full_name, email, phone, role, password
    FROM users
    WHERE email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid Email or Password."
    ]);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid Email or Password."
    ]);
    exit();
}

// Remove password before sending response
unset($user["password"]);

// Success response
echo json_encode([
    "success" => true,
    "message" => "Login Successful",
    "user" => $user
]);

$stmt->close();
$conn->close();

?>