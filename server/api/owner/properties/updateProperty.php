<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../../../config/db.php";

$response = [
    "success" => false,
    "message" => ""
];

try {

    // =====================================================
    // GET FORM DATA
    // =====================================================

    $id = isset($_POST["id"]) ? (int) $_POST["id"] : 0;
    $owner_id = isset($_POST["owner_id"]) ? (int) $_POST["owner_id"] : 0;

    $title = trim($_POST["title"] ?? "");
    $city = trim($_POST["city"] ?? "");
    $location = trim($_POST["location"] ?? "");
    $price = $_POST["price"] ?? "";
    $gender = trim($_POST["gender"] ?? "");
    $description = trim($_POST["description"] ?? "");
    $amenities = trim($_POST["amenities"] ?? "");
    $owner_name = trim($_POST["owner_name"] ?? "");
    $owner_phone = trim($_POST["owner_phone"] ?? "");

    // =====================================================
    // VALIDATE IDs
    // =====================================================

    if ($id <= 0) {
        throw new Exception("Invalid property ID: " . $id);
    }

    if ($owner_id <= 0) {
        throw new Exception("Invalid owner ID: " . $owner_id);
    }

    // =====================================================
    // CHECK OWNER
    // =====================================================

    $ownerStmt = $conn->prepare(
        "SELECT id, role
         FROM users
         WHERE id = ?
         LIMIT 1"
    );

    if (!$ownerStmt) {
        throw new Exception("Owner query failed: " . $conn->error);
    }

    $ownerStmt->bind_param("i", $owner_id);
    $ownerStmt->execute();

    $ownerResult = $ownerStmt->get_result();
    $owner = $ownerResult->fetch_assoc();

    if (!$owner) {
        throw new Exception(
            "Owner not found. Owner ID received: " . $owner_id
        );
    }

    if ($owner["role"] !== "owner") {
        throw new Exception(
            "User ID " . $owner_id . " is not an owner. Current role: " .
            $owner["role"]
        );
    }

    // =====================================================
    // CHECK PROPERTY
    // =====================================================

    $propertyStmt = $conn->prepare(
        "SELECT id, owner_id
         FROM properties
         WHERE id = ?
         LIMIT 1"
    );

    if (!$propertyStmt) {
        throw new Exception(
            "Property query failed: " . $conn->error
        );
    }

    $propertyStmt->bind_param("i", $id);
    $propertyStmt->execute();

    $propertyResult = $propertyStmt->get_result();
    $property = $propertyResult->fetch_assoc();

    if (!$property) {
        throw new Exception(
            "Property not found. Property ID received: " . $id
        );
    }

    // =====================================================
    // CHECK PROPERTY OWNER
    // =====================================================

    if (
        $property["owner_id"] === null ||
        (int) $property["owner_id"] !== $owner_id
    ) {
        throw new Exception(
            "Property ownership mismatch. " .
            "Property owner ID: " .
            ($property["owner_id"] ?? "NULL") .
            ", Logged-in owner ID: " .
            $owner_id
        );
    }

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (
        empty($title) ||
        empty($city) ||
        empty($location) ||
        $price === "" ||
        empty($gender)
    ) {
        throw new Exception(
            "Please fill all required fields."
        );
    }

    // =====================================================
    // UPDATE PROPERTY
    // =====================================================

    $updateStmt = $conn->prepare(
        "UPDATE properties
         SET
            title = ?,
            city = ?,
            location = ?,
            price = ?,
            gender = ?,
            description = ?,
            amenities = ?,
            owner_name = ?,
            owner_phone = ?
         WHERE id = ?
         AND owner_id = ?"
    );

    if (!$updateStmt) {
        throw new Exception(
            "Update query failed: " . $conn->error
        );
    }

    $price = (float) $price;

    $updateStmt->bind_param(
        "sssdsssssii",
        $title,
        $city,
        $location,
        $price,
        $gender,
        $description,
        $amenities,
        $owner_name,
        $owner_phone,
        $id,
        $owner_id
    );

    if (!$updateStmt->execute()) {
        throw new Exception(
            "Failed to update property: " .
            $updateStmt->error
        );
    }

    // =====================================================
    // UPLOAD NEW IMAGES
    // =====================================================

    $uploadedImages = [];

    $uploadDir = "../../../uploads/properties/";

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception(
                "Unable to create upload directory."
            );
        }
    }

    if (
        isset($_FILES["images"]) &&
        isset($_FILES["images"]["name"]) &&
        is_array($_FILES["images"]["name"])
    ) {

        $files = $_FILES["images"];

        $allowedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ];

        $allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        for (
            $i = 0;
            $i < count($files["name"]);
            $i++
        ) {

            if (
                $files["error"][$i] !==
                UPLOAD_ERR_OK
            ) {
                continue;
            }

            $originalName = $files["name"][$i];
            $tmpName = $files["tmp_name"][$i];

            $extension = strtolower(
                pathinfo(
                    $originalName,
                    PATHINFO_EXTENSION
                )
            );

            if (
                !in_array(
                    $extension,
                    $allowedExtensions,
                    true
                )
            ) {
                continue;
            }

            $mimeType = mime_content_type($tmpName);

            if (
                !in_array(
                    $mimeType,
                    $allowedMimeTypes,
                    true
                )
            ) {
                continue;
            }

            $newFileName =
                uniqid("property_", true) .
                "." .
                $extension;

            $destination =
                $uploadDir .
                $newFileName;

            if (
                move_uploaded_file(
                    $tmpName,
                    $destination
                )
            ) {

                $imageStmt = $conn->prepare(
                    "INSERT INTO property_images
                    (property_id, image)
                    VALUES (?, ?)"
                );

                if (!$imageStmt) {
                    continue;
                }

                $imageStmt->bind_param(
                    "is",
                    $id,
                    $newFileName
                );

                if ($imageStmt->execute()) {
                    $uploadedImages[] =
                        $newFileName;
                }
            }
        }
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    $response["success"] = true;
    $response["message"] =
        "Property updated successfully.";

    $response["property_id"] = $id;
    $response["uploaded_images"] =
        $uploadedImages;

    echo json_encode($response);

} catch (Exception $e) {

    http_response_code(400);

    $response["success"] = false;
    $response["message"] = $e->getMessage();

    echo json_encode($response);
}

?>