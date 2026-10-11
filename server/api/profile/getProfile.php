<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_GET["id"] ?? ($data["user_id"] ?? "");

if (empty($user_id)) {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required."
    ]);
    exit();
}

$stmt = $conn->prepare("
    SELECT
        id,
        full_name,
        email,
        phone,
        role,
        bio,
        city,
        profile_image
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

echo json_encode([
    "success" => true,
    "message" => "Profile fetched successfully.",
    "user" => $user
]);

$stmt->close();
$conn->close();

?>