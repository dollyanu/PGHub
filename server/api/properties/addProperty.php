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

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Get values
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

// Validation
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

// Insert property
$stmt = $conn->prepare("
    INSERT INTO properties
    (
        title,
        city,
        location,
        price,
        gender,
        image,
        description,
        amenities,
        owner_name,
        owner_phone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssdssssss",
    $title,
    $city,
    $location,
    $price,
    $gender,
    $image,
    $description,
    $amenities,
    $owner_name,
    $owner_phone
);

if ($stmt->execute()) {

    $property_id = $stmt->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Property added successfully.",
        "property_id" => $property_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add property."
    ]);
}

$stmt->close();
$conn->close();

?>