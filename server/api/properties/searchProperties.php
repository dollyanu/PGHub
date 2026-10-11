<?php

include "../../config/cors.php";
include "../../config/db.php";

header("Content-Type: application/json");

$search = trim($_GET["search"] ?? "");

if ($search === "") {
    echo json_encode([
        "success" => false,
        "message" => "Search keyword is required."
    ]);
    exit();
}

$searchText = "%" . $search . "%";

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
    WHERE
        title LIKE ?
        OR city LIKE ?
        OR location LIKE ?
    ORDER BY created_at DESC
");

$stmt->bind_param(
    "sss",
    $searchText,
    $searchText,
    $searchText
);

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
    "message" => "Properties searched successfully.",
    "count" => count($properties),
    "properties" => $properties
]);

$stmt->close();
$conn->close();

?>