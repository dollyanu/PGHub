<?php

include "../../config/cors.php";

// Start session
session_start();

// Clear session data
session_unset();
session_destroy();

// Response
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully."
]);

?>