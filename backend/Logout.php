<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    echo json_encode(["estado" => "ok", "mensaje" => "Sesión cerrada exitosamente"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error: " . $e->getMessage()]);
}
?>