<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (isset($_SESSION['user_id'])) {
        // Refresca el timestamp de última actividad (opcional)
        $_SESSION['last_activity'] = time();

        echo json_encode([
            "estado" => "ok",
            "usuario" => [
                "id"     => $_SESSION['user_id'],
                "nombre" => $_SESSION['user_name'],
                "correo" => $_SESSION['user_email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["estado" => "error", "mensaje" => "No hay sesión activa"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error en verificación de sesión: " . $e->getMessage()]);
}

ob_end_flush();
