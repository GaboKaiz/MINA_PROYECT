<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once(__DIR__ . '/Conexion.php');


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
        $input = json_decode(file_get_contents('php://input'), true);

        $required_fields = ['dioxido_nitrogeno', 'temperatura', 'humedad', 'pulso', 'x', 'y', 'z', 'gx', 'gy', 'gz', 'id_equipo'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(["error" => "Falta el campo: $field"]);
                return;
            }
        }

        // Extraer y limpiar los datos
        $dioxido_nitrogeno = (float)$input['dioxido_nitrogeno'];
        $temperatura = (float)$input['temperatura'];
        $humedad = (float)$input['humedad'];
        $pulso = (int)$input['pulso'];
        $x = (float)$input['x'];
        $y = (float)$input['y'];
        $z = (float)$input['z'];
        $gx = (float)$input['gx'];
        $gy = (float)$input['gy'];
        $gz = (float)$input['gz'];
        $id_equipo = (int)$input['id_equipo'];

        try {
            $sql = "INSERT INTO sensores_vitales (
                        dioxido_nitrogeno, temperatura, humedad, pulso,
                        x, y, z, gx, gy, gz, id_equipo, fecha_hora
                    ) VALUES (
                        :dioxido_nitrogeno, :temperatura, :humedad, :pulso,
                        :x, :y, :z, :gx, :gy, :gz, :id_equipo, NOW()
                    )";

            $stmt = $this->conexion->prepare($sql);

            $stmt->bindParam(':dioxido_nitrogeno', $dioxido_nitrogeno);
            $stmt->bindParam(':temperatura', $temperatura);
            $stmt->bindParam(':humedad', $humedad);
            $stmt->bindParam(':pulso', $pulso);
            $stmt->bindParam(':x', $x);
            $stmt->bindParam(':y', $y);
            $stmt->bindParam(':z', $z);
            $stmt->bindParam(':gx', $gx);
            $stmt->bindParam(':gy', $gy);
            $stmt->bindParam(':gz', $gz);
            $stmt->bindParam(':id_equipo', $id_equipo);

            $stmt->execute();

            http_response_code(201);
            echo json_encode(["message" => "Datos guardados correctamente"]);
        } catch (PDOException $e) {
            http_response_code(500);
            // En producción evita exponer mensajes de error internos
            // echo json_encode(["error" => "Error al guardar los datos: " . $e->getMessage()]);
            echo json_encode(["error" => "Error al guardar los datos"]);
            error_log("Error al guardar sensores: " . $e->getMessage());
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $api = new SensoresVitales();
    $api->guardarDatos();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido, use POST"]);
}
