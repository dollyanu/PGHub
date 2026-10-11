<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed."
    ]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"] ?? 0);
$property_id = intval($data["property_id"] ?? 0);

if ($user_id <= 0 || $property_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user ID and property ID are required."
    ]);
    exit();
}

/* Check user */
$userCheck = $conn->prepare("
    SELECT id
    FROM users
    WHERE id = ?
");

$userCheck->bind_param("i", $user_id);
$userCheck->execute();

$userResult = $userCheck->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);

    $userCheck->close();
    $conn->close();
    exit();
}

$userCheck->close();

/* Check property */
$propertyCheck = $conn->prepare("
    SELECT id
    FROM properties
    WHERE id = ?
");

$propertyCheck->bind_param("i", $property_id);
$propertyCheck->execute();

$propertyResult = $propertyCheck->get_result();

if ($propertyResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Property not found."
    ]);

    $propertyCheck->close();
    $conn->close();
    exit();
}

$propertyCheck->close();

/* Check if already shortlisted */
$check = $conn->prepare("
    SELECT id
    FROM shortlist
    WHERE user_id = ? AND property_id = ?
");

$check->bind_param("ii", $user_id, $property_id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Property is already in your shortlist."
    ]);

    $check->close();
    $conn->close();
    exit();
}

$check->close();

/* Add to shortlist */
$stmt = $conn->prepare("
    INSERT INTO shortlist (user_id, property_id)
    VALUES (?, ?)
");

$stmt->bind_param("ii", $user_id, $property_id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Property added to shortlist.",
        "shortlist_id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add property to shortlist."
    ]);
}

$stmt->close();
$conn->close();

?>