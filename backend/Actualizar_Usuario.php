<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

require_once '../API/Conexion.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("No se ha iniciado sesión");
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['nombre']) || !isset($data['correo']) || !isset($data['password'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $user_id = $_SESSION['user_id'];
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

    // Check if email is taken by another user
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? AND id != ?");
    $stmt->execute([$correo, $user_id]);
    if ($stmt->rowCount() > 0) {
        throw new Exception("El correo ya está registrado por otro usuario");
    }

    // Update user data
    $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?");
    $stmt->execute([$nombre, $correo, $password, $user_id]);

    // Update session data
    $_SESSION['user_name'] = $nombre;
    $_SESSION['user_email'] = $correo;

    echo json_encode(["estado" => "ok", "mensaje" => "Datos actualizados exitosamente"]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>