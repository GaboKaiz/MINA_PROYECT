<?php
class Conexion
{
    private $host = "127.0.0.1";
    private $dbname = "bd_jeremias";
    private $user = "root";
    private $password = "";
    private $conexion;

    public function conectar()
    {
        try {
            $this->conexion = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->user, $this->password);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conexion->exec("SET CHARACTER SET utf8");
            return $this->conexion;
        } catch (PDOException $e) {
            header('Content-Type: application/json; charset=UTF-8');
            http_response_code(500);
            echo json_encode(['estado' => 'error', 'mensaje' => 'Error de conexión: ' . $e->getMessage()]);
            exit;
        }
    }
}
?>