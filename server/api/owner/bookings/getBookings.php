<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$ownerId = $_GET["owner_id"] ?? "";

if (!$ownerId || !is_numeric($ownerId)) {
    echo json_encode([
        "success" => false,
        "message" => "Valid owner ID is required."
    ]);
    exit();
}

$ownerId = (int) $ownerId;

try {

    $stmt = $conn->prepare("
        SELECT
            b.id,
            b.user_id,
            b.property_id,
            b.booking_date,
            b.move_in_date,
            b.status,
            b.created_at,

            u.full_name AS student_name,
            u.email AS student_email,
            u.phone AS student_phone,

            p.title AS property_title,
            p.city AS property_city,
            p.location AS property_location,
            p.price AS property_price

        FROM bookings b

        INNER JOIN properties p
            ON b.property_id = p.id

        INNER JOIN users u
            ON b.user_id = u.id

        WHERE p.owner_id = ?

        ORDER BY b.id DESC
    ");

    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $result = $stmt->get_result();

    $bookings = [];

    while ($row = $result->fetch_assoc()) {

        $row["id"] = (int) $row["id"];
        $row["user_id"] = (int) $row["user_id"];
        $row["property_id"] = (int) $row["property_id"];
        $row["property_price"] = (float) $row["property_price"];

        $bookings[] = $row;
    }

    echo json_encode([
        "success" => true,
        "bookings" => $bookings,
        "count" => count($bookings)
    ]);

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load owner bookings.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>