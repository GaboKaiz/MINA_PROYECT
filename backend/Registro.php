<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

require_once '../API/Conexion.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['nombre']) || !isset($data['correo']) || !isset($data['password'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $nombre = trim($data['nombre']);
    $correo = trim($data['correo']);
    $password = trim($data['password']);

    if (empty($nombre) || empty($correo) || empty($password)) {
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
    if ($stmt->rowCount() > 0) {
        throw new Exception("El correo ya está registrado");
    }

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $correo, $password]);

    echo json_encode(["estado" => "ok", "mensaje" => "Usuario registrado exitosamente"]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>