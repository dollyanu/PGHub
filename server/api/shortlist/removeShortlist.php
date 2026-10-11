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

$check = $conn->prepare("
    SELECT id
    FROM shortlist
    WHERE user_id = ? AND property_id = ?
");

$check->bind_param("ii", $user_id, $property_id);
$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Property is not in your shortlist."
    ]);

    $check->close();
    $conn->close();
    exit();
}

$check->close();

$stmt = $conn->prepare("
    DELETE FROM shortlist
    WHERE user_id = ? AND property_id = ?
");

$stmt->bind_param("ii", $user_id, $property_id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Property removed from shortlist."
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to remove property from shortlist."
    ]);
}

$stmt->close();
$conn->close();

?>