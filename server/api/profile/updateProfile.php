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

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);
$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? "");
$city = trim($data["city"] ?? "");
$bio = trim($data["bio"] ?? "");

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);
    exit();
}

if (empty($full_name) || empty($email)) {
    echo json_encode([
        "success" => false,
        "message" => "Name and email are required."
    ]);
    exit();
}

/* Check whether email already belongs to another user */
$check = $conn->prepare("
    SELECT id
    FROM users
    WHERE email = ? AND id != ?
");

$check->bind_param("si", $email, $id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email is already being used by another account."
    ]);
    exit();
}

$check->close();

/* Update profile */
$stmt = $conn->prepare("
    UPDATE users
    SET
        full_name = ?,
        email = ?,
        phone = ?,
        city = ?,
        bio = ?
    WHERE id = ?
");

$stmt->bind_param(
    "sssssi",
    $full_name,
    $email,
    $phone,
    $city,
    $bio,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update profile."
    ]);
}

$stmt->close();
$conn->close();

?>