<?php
header("Content-Type: application/json; charset=UTF-8");
require_once 'Conexion.php';

class SensoresVitales
{
    private $conexion;

    public function __construct()
    {
        $db = new Conexion();
        $this->conexion = $db->conectar();
    }

    public function guardarDatos()
    {
        // Obtener datos del cuerpo de la solicitud
        $input = json_decode(file_get_contents('php://input'), true);

        // Validar que se recibieron todos los campos necesarios
        $required_fields = ['dioxido_nitrogeno', 'temperatura', 'humedad', 'pulso', 'x', 'y', 'z', 'gx', 'gy', 'gz', 'id_equipo'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(["error" => "Falta el campo: $field"]);
                return;
            }
        }

        // Extraer datos
        $dioxido_nitrogeno = $input['dioxido_nitrogeno'];
        $temperatura = $input['temperatura'];
        $humedad = $input['humedad'];
        $pulso = $input['pulso'];
        $x = $input['x'];
        $y = $input['y'];
        $z = $input['z'];
        $gx = $input['gx'];
        $gy = $input['gy'];
        $gz = $input['gz'];
        $id_equipo = $input['id_equipo'];

        try {
            // Preparar la consulta SQL
            $sql = "INSERT INTO sensores_vitales (dioxido_nitrogeno, temperatura, humedad, pulso, x, y, z, gx, gy, gz, id_equipo, fecha_hora)
                    VALUES (:dioxido_nitrogeno, :temperatura, :humedad, :pulso, :x, :y, :z, :gx, :gy, :gz, :id_equipo, NOW())";
            $stmt = $this->conexion->prepare($sql);

            // Vincular parámetros
            $stmt->bindParam(':dioxido_nitrogeno', $dioxido_nitrogeno, PDO::PARAM_STR);
            $stmt->bindParam(':temperatura', $temperatura, PDO::PARAM_STR);
            $stmt->bindParam(':humedad', $humedad, PDO::PARAM_STR);
            $stmt->bindParam(':pulso', $pulso, PDO::PARAM_INT);
            $stmt->bindParam(':x', $x, PDO::PARAM_STR);
            $stmt->bindParam(':y', $y, PDO::PARAM_STR);
            $stmt->bindParam(':z', $z, PDO::PARAM_STR);
            $stmt->bindParam(':gx', $gx, PDO::PARAM_STR);
            $stmt->bindParam(':gy', $gy, PDO::PARAM_STR);
            $stmt->bindParam(':gz', $gz, PDO::PARAM_STR);
            $stmt->bindParam(':id_equipo', $id_equipo, PDO::PARAM_INT);

            // Ejecutar la consulta
            $stmt->execute();

            http_response_code(201);
            echo json_encode(["message" => "Datos guardados correctamente"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
        }
    }
}

// Procesar la solicitud
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $api = new SensoresVitales();
    $api->guardarDatos();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido, use POST"]);
}
?>