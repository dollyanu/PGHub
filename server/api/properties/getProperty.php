<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../config/db.php";

$response = [
    "success" => false,
    "message" => ""
];

try {

    /*
    |--------------------------------------------------------------------------
    | Get Property ID
    |--------------------------------------------------------------------------
    */

    $id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

    if ($id <= 0) {
        throw new Exception("Invalid property ID.");
    }

    /*
    |--------------------------------------------------------------------------
    | Get Property Details
    |--------------------------------------------------------------------------
    */

    $stmt = $conn->prepare(
        "SELECT
            id,
            title,
            city,
            location,
            price,
            gender,
            image,
            description,
            amenities,
            owner_id,
            owner_name,
            owner_phone,
            created_at
         FROM properties
         WHERE id = ?
         LIMIT 1"
    );

    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Property not found.");
    }

    $property = $result->fetch_assoc();

    /*
    |--------------------------------------------------------------------------
    | Get Multiple Images
    |--------------------------------------------------------------------------
    */

    $imageStmt = $conn->prepare(
        "SELECT id, image
         FROM property_images
         WHERE property_id = ?
         ORDER BY id ASC"
    );

    $imageStmt->bind_param("i", $id);
    $imageStmt->execute();

    $imageResult = $imageStmt->get_result();

    $images = [];

    while ($image = $imageResult->fetch_assoc()) {
        $images[] = [
            "id" => $image["id"],
            "image" => $image["image"]
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Add Images To Property Response
    |--------------------------------------------------------------------------
    */

    $property["images"] = $images;

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    $response["success"] = true;
    $response["message"] = "Property fetched successfully.";
    $response["property"] = $property;

    echo json_encode($response);

} catch (Exception $e) {

    http_response_code(400);

    $response["message"] = $e->getMessage();

    echo json_encode($response);
}

?>