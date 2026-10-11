<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$user_id = intval($_GET["user_id"] ?? 0);
$property_id = intval($_GET["property_id"] ?? 0);

if ($user_id <= 0 || $property_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user ID and property ID are required."
    ]);
    exit();
}

/* Check whether property is in user's shortlist */
$stmt = $conn->prepare("
    SELECT id
    FROM shortlist
    WHERE user_id = ? AND property_id = ?
");

$stmt->bind_param("ii", $user_id, $property_id);
$stmt->execute();

$result = $stmt->get_result();

$isShortlisted = $result->num_rows > 0;

echo json_encode([
    "success" => true,
    "is_shortlisted" => $isShortlisted,
    "user_id" => $user_id,
    "property_id" => $property_id
]);

$stmt->close();
$conn->close();

?>