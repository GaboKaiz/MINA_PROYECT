<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["estado" => "error", "mensaje" => "Método no permitido"]);
        exit();
    }

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["estado" => "error", "mensaje" => "No se ha iniciado sesión"]);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id_equipo'])) {
        http_response_code(400);
        echo json_encode(["estado" => "error", "mensaje" => "Falta el parámetro 'id_equipo'"]);
        exit();
    }

    $id_equipo = intval($input['id_equipo']);

    $db = new Conexion();
    $conn = $db->conectar();

    $stmt = $conn->prepare("SELECT dioxido_nitrogeno, temperatura, humedad, pulso, fecha_hora FROM sensores_vitales WHERE id_equipo = ? ORDER BY fecha_hora DESC LIMIT 50");
    $stmt->execute([$id_equipo]);

    $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "estado" => "ok",
        "mensaje" => "Datos obtenidos correctamente",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["estado" => "error", "mensaje" => "Error al obtener los datos: " . $e->getMessage()]);
}
?>
