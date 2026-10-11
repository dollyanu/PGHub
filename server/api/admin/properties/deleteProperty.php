<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$id = $_GET["id"] ?? "";

if (!$id || !is_numeric($id)) {

    echo json_encode([
        "success" => false,
        "message" => "Valid property ID is required."
    ]);

    exit();
}

$id = (int) $id;

try {

    // Check property
    $checkStmt = $conn->prepare("
        SELECT id
        FROM properties
        WHERE id = ?
    ");

    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();

    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "Property not found."
        ]);

        $checkStmt->close();
        $conn->close();
        exit();
    }

    $checkStmt->close();

    // Delete property
    $deleteStmt = $conn->prepare("
        DELETE FROM properties
        WHERE id = ?
    ");

    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Property deleted successfully."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete property."
        ]);
    }

    $deleteStmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Delete property failed.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>