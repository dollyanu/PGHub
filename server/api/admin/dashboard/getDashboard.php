<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$usersQuery = $conn->query("
    SELECT COUNT(*) AS total
    FROM users
");

$propertiesQuery = $conn->query("
    SELECT COUNT(*) AS total
    FROM properties
");

$bookingsQuery = $conn->query("
    SELECT COUNT(*) AS total
    FROM bookings
");

$pendingQuery = $conn->query("
    SELECT COUNT(*) AS total
    FROM bookings
    WHERE status = 'Pending'
");

$users = (int) $usersQuery->fetch_assoc()["total"];
$properties = (int) $propertiesQuery->fetch_assoc()["total"];
$bookings = (int) $bookingsQuery->fetch_assoc()["total"];
$pending = (int) $pendingQuery->fetch_assoc()["total"];

echo json_encode([
    "success" => true,
    "stats" => [
        "users" => $users,
        "properties" => $properties,
        "bookings" => $bookings,
        "pending_bookings" => $pending
    ]
]);

$conn->close();

?>