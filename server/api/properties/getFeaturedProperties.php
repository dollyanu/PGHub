<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../../config/db.php";

try {
    $sql = "SELECT
                id,
                title,
                city,
                location,
                price,
                gender,
                image,
                description,
                amenities
            FROM properties
            ORDER BY created_at DESC
            LIMIT 3";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Failed to fetch properties.");
    }

    $properties = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row["amenities"])) {
            $row["amenities"] = array_map(
                "trim",
                explode(",", $row["amenities"])
            );
        } else {
            $row["amenities"] = [];
        }

        $row["price"] = (float) $row["price"];
        $properties[] = $row;
    }

    echo json_encode([
        "success" => true,
        "message" => "Featured properties fetched successfully.",
        "properties" => $properties
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to fetch featured properties."
    ]);
}
?>