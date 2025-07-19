<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once(__DIR__ . '/Conexion.php');


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        throw new Exception("No se ha iniciado sesión");
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['descripcion'], $data['codigo_equipo'], $data['fecha_instalacion'])) {
        throw new Exception("Faltan datos requeridos");
    }

    $id_usuario = $_SESSION['user_id'];
    $descripcion = trim($data['descripcion']);
    $codigo_equipo = trim($data['codigo_equipo']);
    $fecha_instalacion = trim($data['fecha_instalacion']);

    if (empty($descripcion) || empty($codigo_equipo) || empty($fecha_instalacion)) {
        throw new Exception("Todos los campos son obligatorios");
    }

    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $fecha_instalacion)) {
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
