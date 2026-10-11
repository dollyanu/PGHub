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

    // =========================
    // Total Properties
    // =========================
    $propertyStmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM properties
        WHERE owner_id = ?
    ");

    $propertyStmt->bind_param("i", $ownerId);
    $propertyStmt->execute();

    $properties = (int) $propertyStmt
        ->get_result()
        ->fetch_assoc()["total"];

    $propertyStmt->close();


    // =========================
    // Total Bookings
    // =========================
    $bookingStmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM bookings b
        INNER JOIN properties p
            ON b.property_id = p.id
        WHERE p.owner_id = ?
    ");

    $bookingStmt->bind_param("i", $ownerId);
    $bookingStmt->execute();

    $bookings = (int) $bookingStmt
        ->get_result()
        ->fetch_assoc()["total"];

    $bookingStmt->close();


    // =========================
    // Pending Bookings
    // =========================
    $pendingStmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM bookings b
        INNER JOIN properties p
            ON b.property_id = p.id
        WHERE p.owner_id = ?
        AND b.status = 'Pending'
    ");

    $pendingStmt->bind_param("i", $ownerId);
    $pendingStmt->execute();

    $pending = (int) $pendingStmt
        ->get_result()
        ->fetch_assoc()["total"];

    $pendingStmt->close();


    // =========================
    // Total Shortlists
    // =========================
    $shortlistStmt = $conn->prepare("
        SELECT COUNT(*) AS total
        FROM shortlist s
        INNER JOIN properties p
            ON s.property_id = p.id
        WHERE p.owner_id = ?
    ");

    $shortlistStmt->bind_param("i", $ownerId);
    $shortlistStmt->execute();

    $shortlists = (int) $shortlistStmt
        ->get_result()
        ->fetch_assoc()["total"];

    $shortlistStmt->close();


    // =========================
    // Final Response
    // =========================
    echo json_encode([
        "success" => true,
        "stats" => [
            "properties" => $properties,
            "bookings" => $bookings,
            "pending_bookings" => $pending,
            "shortlists" => $shortlists
        ]
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load owner dashboard.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>