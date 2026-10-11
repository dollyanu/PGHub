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
    $sql = "SELECT city, COUNT(*) AS property_count
            FROM properties
            WHERE city IS NOT NULL
              AND TRIM(city) <> ''
            GROUP BY city
            ORDER BY property_count DESC";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Unable to fetch cities.");
    }

    $cities = [];

    while ($row = $result->fetch_assoc()) {
        $cities[] = [
            "name" => $row["city"],
            "property_count" => (int) $row["property_count"]
        ];
    }

    echo json_encode([
        "success" => true,
        "cities" => $cities
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to fetch popular cities."
    ]);
}
?>