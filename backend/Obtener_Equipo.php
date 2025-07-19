<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET");
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

    $db = new Conexion();
    $conn = $db->conectar();
    $user_id = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT id_equipo, descripcion, codigo_equipo, fecha_instalacion FROM equipo WHERE id_usuario = ?");
    $stmt->execute([$user_id]);

    $equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["estado" => "ok", "datos" => $equipos]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>