<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

try {

    $stmt = $conn->prepare("
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
        ORDER BY id DESC
    ");

    $stmt->execute();

    $result = $stmt->get_result();

    $properties = [];

    while ($row = $result->fetch_assoc()) {

        $row["id"] = (int) $row["id"];
        $row["price"] = (float) $row["price"];

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
        "message" => "Admin properties fetched successfully.",
        "count" => count($properties),
        "properties" => $properties
    ]);

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch properties.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>