<?php

include "../../../config/cors.php";
include "../../../config/db.php";

header("Content-Type: application/json");

$id = $_GET["id"] ?? "";

if (!$id || !is_numeric($id)) {

    echo json_encode([
        "success" => false,
        "message" => "Valid user ID is required."
    ]);

    exit();
}

$id = (int) $id;

try {

    // Check user
    $checkStmt = $conn->prepare("
        SELECT id, role
        FROM users
        WHERE id = ?
    ");

    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();

    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {

        echo json_encode([
            "success" => false,
            "message" => "User not found."
        ]);

        $checkStmt->close();
        $conn->close();
        exit();
    }

    $user = $result->fetch_assoc();

    // Don't allow admin deletion
    if ($user["role"] === "admin") {

        echo json_encode([
            "success" => false,
            "message" => "Admin users cannot be deleted."
        ]);

        $checkStmt->close();
        $conn->close();
        exit();
    }

    $checkStmt->close();

    // Delete user
    $deleteStmt = $conn->prepare("
        DELETE FROM users
        WHERE id = ?
    ");

    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "User deleted successfully."
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => "Failed to delete user."
        ]);
    }

    $deleteStmt->close();

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Delete user failed.",
        "error" => $e->getMessage()
    ]);
}

$conn->close();

?>