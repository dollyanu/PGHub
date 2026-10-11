<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$sql = "
    SELECT
        id,
        title,
        city,
        location,
        price,
        gender,
        image,
        description,
        amenities,
        owner_name,
        owner_phone,
        created_at
    FROM properties
    ORDER BY created_at DESC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch properties."
    ]);
    exit();
}

$properties = [];

while ($row = $result->fetch_assoc()) {

    // Convert price into number
    $row["price"] = (float) $row["price"];

    // Convert amenities text into array
    if (!empty($row["amenities"])) {
        $row["amenities"] = array_map(
            "trim",
            explode(",", $row["amenities"])
        );
    } else {
        $row["amenities"] = [];
    }

    $properties[] = $row;
}

echo json_encode([
    "success" => true,
    "message" => "Properties fetched successfully.",
    "count" => count($properties),
    "properties" => $properties
]);

$conn->close();

?>