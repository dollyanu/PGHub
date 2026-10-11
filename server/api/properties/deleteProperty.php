<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    echo json_encode([
        "success" => false,
        "message" => "Only DELETE request is allowed."
    ]);
    exit();
}

// Get ID from URL first
$id = intval($_GET["id"] ?? 0);

// If ID is not in URL, check JSON body
if ($id <= 0) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data["id"] ?? 0);
}

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid property ID is required."
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

// Delete property
$stmt = $conn->prepare("
    DELETE FROM properties
    WHERE id = ?
");

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Property deleted successfully.",
        "property_id" => $id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete property."
    ]);
}

$stmt->close();
$conn->close();

?>