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

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Get values
$id = intval($data["id"] ?? 0);

$title = trim($data["title"] ?? "");
$city = trim($data["city"] ?? "");
$location = trim($data["location"] ?? "");
$price = $data["price"] ?? "";
$gender = trim($data["gender"] ?? "");
$image = trim($data["image"] ?? "");
$description = trim($data["description"] ?? "");
$amenities = trim($data["amenities"] ?? "");
$owner_name = trim($data["owner_name"] ?? "");
$owner_phone = trim($data["owner_phone"] ?? "");

// Validate ID
if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid property ID is required."
    ]);
    exit();
}

// Validate required fields
if (
    empty($title) ||
    empty($city) ||
    empty($location) ||
    empty($price) ||
    empty($gender) ||
    empty($owner_name) ||
    empty($owner_phone)
) {
    echo json_encode([
        "success" => false,
        "message" => "Title, city, location, price, gender, owner name and owner phone are required."
    ]);
    exit();
}

// Validate price
if (!is_numeric($price) || $price <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Price must be a valid positive number."
    ]);
    exit();
}

// Validate gender
$allowed_gender = ["Boys", "Girls", "Unisex"];

if (!in_array($gender, $allowed_gender)) {
    echo json_encode([
        "success" => false,
        "message" => "Gender must be Boys, Girls or Unisex."
    ]);
    exit();
}

// Check whether property exists
$check = $conn->prepare("
    SELECT id
    FROM properties
    WHERE id = ?
");

$check->bind_param("i", $id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Property not found."
    ]);
    $check->close();
    $conn->close();
    exit();
}

$check->close();

// Update property
$stmt = $conn->prepare("
    UPDATE properties
    SET
        title = ?,
        city = ?,
        location = ?,
        price = ?,
        gender = ?,
        image = ?,
        description = ?,
        amenities = ?,
        owner_name = ?,
        owner_phone = ?
    WHERE id = ?
");

$stmt->bind_param(
    "sssdssssssi",
    $title,
    $city,
    $location,
    $price,
    $gender,
    $image,
    $description,
    $amenities,
    $owner_name,
    $owner_phone,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Property updated successfully."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update property."
    ]);
}

$stmt->close();
$conn->close();

?>