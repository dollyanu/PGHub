<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

require_once "../../../config/db.php";

try {

    // ==============================
    // GET FORM DATA
    // ==============================

    $owner_id = $_POST['owner_id'] ?? '';
    $title = $_POST['title'] ?? '';
    $city = $_POST['city'] ?? '';
    $location = $_POST['location'] ?? '';
    $price = $_POST['price'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $description = $_POST['description'] ?? '';
    $amenities = $_POST['amenities'] ?? '';
    $owner_name = $_POST['owner_name'] ?? '';
    $owner_phone = $_POST['owner_phone'] ?? '';


    // ==============================
    // VALIDATION
    // ==============================

    if (
        empty($owner_id) ||
        empty($title) ||
        empty($city) ||
        empty($location) ||
        empty($price) ||
        empty($gender)
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Please fill all required fields."
        ]);

        exit;
    }


    // ==============================
    // CHECK OWNER
    // ==============================

    $ownerCheck = $conn->prepare(
        "SELECT id
         FROM users
         WHERE id = ?
         AND role = 'owner'"
    );

    $ownerCheck->bind_param("i", $owner_id);
    $ownerCheck->execute();

    $ownerResult = $ownerCheck->get_result();

    if ($ownerResult->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid owner."
        ]);

        exit;
    }

    $ownerCheck->close();


    // ==============================
    // INSERT PROPERTY
    // ==============================

    $stmt = $conn->prepare(
        "INSERT INTO properties
        (
            owner_id,
            title,
            city,
            location,
            price,
            gender,
            description,
            amenities,
            owner_name,
            owner_phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "isssdsssss",
        $owner_id,
        $title,
        $city,
        $location,
        $price,
        $gender,
        $description,
        $amenities,
        $owner_name,
        $owner_phone
    );


    if (!$stmt->execute()) {

        echo json_encode([
            "success" => false,
            "message" => "Failed to add property."
        ]);

        exit;
    }

    $property_id = $conn->insert_id;

    $stmt->close();


    // ==============================
    // CREATE UPLOAD DIRECTORY
    // ==============================

    $uploadDir = "../../../uploads/properties/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }


    // ==============================
    // UPLOAD IMAGES
    // ==============================

    $uploadedImages = [];

    if (isset($_FILES['images'])) {

        $files = $_FILES['images'];

        $allowedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ];

        for ($i = 0; $i < count($files['name']); $i++) {

            // Skip failed uploads
            if ($files['error'][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $originalName = $files['name'][$i];
            $tmpName = $files['tmp_name'][$i];

            // Get extension
            $extension = strtolower(
                pathinfo($originalName, PATHINFO_EXTENSION)
            );


            // Check extension
            if (!in_array($extension, $allowedExtensions)) {
                continue;
            }


            // Create unique filename
            $newFileName =
                uniqid("property_", true) . "." . $extension;

            $destination =
                $uploadDir . $newFileName;


            // Move uploaded file
            if (move_uploaded_file($tmpName, $destination)) {

                // ==============================
                // SAVE IMAGE IN property_images
                // ==============================

                $imageStmt = $conn->prepare(
                    "INSERT INTO property_images
                    (
                        property_id,
                        image
                    )
                    VALUES (?, ?)"
                );

                $imageStmt->bind_param(
                    "is",
                    $property_id,
                    $newFileName
                );

                $imageStmt->execute();

                $imageStmt->close();


                // Add image to uploaded list
                $uploadedImages[] = $newFileName;


                // ==============================
                // SET FIRST IMAGE IN properties.image
                // ==============================

                if (count($uploadedImages) === 1) {

                    $updateImageStmt = $conn->prepare(
                        "UPDATE properties
                         SET image = ?
                         WHERE id = ?"
                    );

                    $updateImageStmt->bind_param(
                        "si",
                        $newFileName,
                        $property_id
                    );

                    $updateImageStmt->execute();

                    $updateImageStmt->close();
                }
            }
        }
    }


    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    echo json_encode([
        "success" => true,
        "message" => "Property added successfully.",
        "property_id" => $property_id,
        "images" => $uploadedImages
    ]);


} catch (Exception $e) {

    // ==============================
    // ERROR RESPONSE
    // ==============================

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?>