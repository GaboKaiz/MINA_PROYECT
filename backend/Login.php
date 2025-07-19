<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once(__DIR__ . '/Conexion.php');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    // Asegura que el request sea JSON
    $contentType = $_SERVER["CONTENT_TYPE"] ?? '';
    if (stripos($contentType, 'application/json') === false) {
        throw new Exception("El tipo de contenido debe ser application/json");
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['correo'], $data['password'])) {
        throw new Exception("Faltan datos de inicio de sesión");
    }

    $correo   = trim($data['correo']);
    $password = trim($data['password']);

    if ($correo === '' || $password === '') {
        throw new Exception("Todos los campos son obligatorios");
    }
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Correo electrónico inválido");
    }

    $db = new Conexion();
    $conn = $db->conectar();

    $stmt = $conn->prepare("SELECT id, nombre, correo, password FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($password, $usuario['password'])) {
        throw new Exception("Correo o contraseña incorrectos");
    }

    $_SESSION['user_id']    = $usuario['id'];
    $_SESSION['user_name']  = $usuario['nombre'];
    $_SESSION['user_email'] = $usuario['correo'];
    $_SESSION['last_activity'] = time(); // opcional para control de tiempo

    echo json_encode([
        "estado" => "ok",
        "mensaje" => "Inicio de sesión exitoso",
        "id_usuario" => $usuario['id'],
        "nombre" => $usuario['nombre'],
        "correo" => $usuario['correo']
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}

ob_end_flush();
