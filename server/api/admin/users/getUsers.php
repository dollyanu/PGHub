<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

try {

    $stmt = $conn->prepare("
        SELECT
            id,
            full_name,
            email,
            phone,
            role,
            city,
            created_at
        FROM users
        ORDER BY id DESC
    ");

    $stmt->execute();

    $result = $stmt->get_result();

    $users = [];

    while ($row = $result->fetch_assoc()) {

        $row["id"] = (int) $row["id"];

        $users[] = $row;
    }

    echo json_encode([
        "success" => true,
        "message" => "Users fetched successfully.",
        "count" => count($users),
        "users" => $users
    ]);

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch users.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>