<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../../config/db.php";

$response = [
    "success" => false,
    "message" => "",
    "properties" => []
];

try {

    $owner_id = isset($_GET["owner_id"])
        ? intval($_GET["owner_id"])
        : 0;

    if ($owner_id <= 0) {
        throw new Exception("Invalid owner ID.");
    }

    /*
    |--------------------------------------------------------------------------
    | Get Owner Properties
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
         WHERE owner_id = ?
         ORDER BY id DESC"
    );

    $stmt->bind_param("i", $owner_id);
    $stmt->execute();

    $result = $stmt->get_result();

    /*
    |--------------------------------------------------------------------------
    | Get Properties
    |--------------------------------------------------------------------------
    */

    while ($property = $result->fetch_assoc()) {

        $property_id = intval($property["id"]);

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

        $imageStmt->bind_param("i", $property_id);
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
        | Add Images Array
        |--------------------------------------------------------------------------
        */

        $property["images"] = $images;

        /*
        |--------------------------------------------------------------------------
        | Add Property To Response
        |--------------------------------------------------------------------------
        */

        $response["properties"][] = $property;
    }

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    $response["success"] = true;
    $response["message"] = "Owner properties fetched successfully.";

    echo json_encode($response);

} catch (Exception $e) {

    http_response_code(400);

    $response["message"] = $e->getMessage();

    echo json_encode($response);
}

?>