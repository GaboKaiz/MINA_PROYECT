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
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['nombre'], $data['correo'], $data['password'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $nombre   = trim($data['nombre']);
    $correo   = trim($data['correo']);
    $password = trim($data['password']);

    if ($nombre === '' || $correo === '' || $password === '') {
        throw new Exception("Todos los campos son obligatorios");
    }
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Correo electrónico inválido");
    }
    if (strlen($password) < 6) {
        throw new Exception("La contraseña debe tener al menos 6 caracteres");
    }

    $db = new Conexion();
    $conn = $db->conectar();

    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch()) {
        throw new Exception("El correo ya está registrado");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $correo, $hashedPassword]);

    $user_id = $conn->lastInsertId();
    $_SESSION['user_id'] = $user_id;

    echo json_encode([
        "estado" => "ok",
        "mensaje" => "Usuario registrado y sesión iniciada",
        "id_usuario" => $user_id,
        "nombre" => $nombre,
        "correo" => $correo
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}

ob_end_flush();
