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

    if (!isset($data['descripcion']) || !isset($data['codigo_equipo']) || !isset($data['fecha_instalacion'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $id_usuario = $_SESSION['user_id'];
    $descripcion = trim($data['descripcion']);
    $codigo_equipo = trim($data['codigo_equipo']);
    $fecha_instalacion = trim($data['fecha_instalacion']);

    if (empty($descripcion) || empty($codigo_equipo) || empty($fecha_instalacion)) {
        throw new Exception("Todos los campos son obligatorios");
    }
    if (!preg_match("/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/", $fecha_instalacion)) {
        throw new Exception("Formato de fecha inválido (debe ser YYYY-MM-DD)");
    }

    $db = new Conexion();
    $conn = $db->conectar();

    // Verificar si el código de equipo ya existe
    $stmt = $conn->prepare("SELECT id_equipo FROM equipo WHERE codigo_equipo = ?");
    $stmt->execute([$codigo_equipo]);
    if ($stmt->rowCount() > 0) {
        throw new Exception("El código de equipo ya está registrado");
    }

    // Insertar el equipo
    $stmt = $conn->prepare("INSERT INTO equipo (descripcion, codigo_equipo, fecha_instalacion, id_usuario) VALUES (?, ?, ?, ?)");
    $stmt->execute([$descripcion, $codigo_equipo, $fecha_instalacion, $id_usuario]);

    echo json_encode(["estado" => "ok", "mensaje" => "Equipo registrado exitosamente"]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>