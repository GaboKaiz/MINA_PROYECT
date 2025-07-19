<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (isset($_SESSION['user_id'])) {
        $_SESSION['last_activity'] = time();
        echo json_encode([
            "estado" => "ok",
            "usuario" => [
                "id" => $_SESSION['user_id'],
                "nombre" => $_SESSION['user_name'],
                "correo" => $_SESSION['user_email']
            ]
        ]);
    } else {
        echo json_encode(["estado" => "error", "mensaje" => "No hay sesión activa"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error: " . $e->getMessage()]);
}
?>