<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$ownerId = $_GET["owner_id"] ?? "";
$propertyId = $_GET["id"] ?? "";

if (
    !$ownerId ||
    !is_numeric($ownerId) ||
    !$propertyId ||
    !is_numeric($propertyId)
) {
    echo json_encode([
        "success" => false,
        "message" => "Valid owner and property IDs are required."
    ]);
    exit();
}

$ownerId = (int) $ownerId;
$propertyId = (int) $propertyId;

try {

    $stmt = $conn->prepare("
        DELETE FROM properties
        WHERE id = ?
        AND owner_id = ?
    ");

    $stmt->bind_param(
        "ii",
        $propertyId,
        $ownerId
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Property deleted successfully."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Property not found or access denied."
        ]);
    }

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete property.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>