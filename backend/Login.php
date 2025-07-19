<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

require_once '../API/Conexion.php';

try {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        session_start();
        session_regenerate_id(true);
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['correo']) || !isset($data['password'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $correo = trim($data['correo']);
    $password = trim($data['password']);

    if (empty($correo) || empty($password)) {
        throw new Exception("Correo y contraseña son obligatorios");
    }
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Correo electrónico inválido");
    }

    $db = new Conexion();
    $conn = $db->conectar();
    $stmt = $conn->prepare("SELECT id, nombre, correo, password FROM usuarios WHERE correo = ? AND password = ?");
    $stmt->execute([$correo, $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['nombre'];
        $_SESSION['user_email'] = $user['correo'];
        $_SESSION['last_activity'] = time();

        echo json_encode([
            "estado" => "ok",
            "mensaje" => "Inicio de sesión exitoso",
            "usuario" => [
                "id" => $user['id'],
                "nombre" => $user['nombre'],
                "correo" => $user['correo']
            ]
        ]);
    } else {
        echo json_encode(["estado" => "error", "mensaje" => "Correo o contraseña incorrectos"]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>