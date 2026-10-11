<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

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

            u.full_name AS user_name,
            u.email AS user_email,
            u.phone AS user_phone,

            p.title AS property_title,
            p.city AS property_city,
            p.location AS property_location,
            p.price AS property_price,
            p.gender AS property_gender

        FROM bookings b

        LEFT JOIN users u
            ON b.user_id = u.id

        LEFT JOIN properties p
            ON b.property_id = p.id

        ORDER BY b.id DESC
    ");

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
        "message" => "Bookings fetched successfully.",
        "count" => count($bookings),
        "bookings" => $bookings
    ]);

    $stmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch bookings.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>