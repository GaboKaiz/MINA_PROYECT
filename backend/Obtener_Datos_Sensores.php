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
    $stmt = $conn->prepare("SELECT sv.id, sv.dioxido_nitrogeno, sv.temperatura, sv.humedad, sv.pulso, sv.x, sv.y, sv.z, sv.gx, sv.gy, sv.gz, sv.fecha_hora FROM sensores_vitales sv JOIN equipo e ON sv.id_equipo = e.id_equipo WHERE e.id_usuario = ? ORDER BY sv.fecha_hora DESC");
    $stmt->execute([$user_id]);

    $sensores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["estado" => "ok", "datos" => $sensores]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["estado" => "error", "mensaje" => $e->getMessage()]);
}
?>