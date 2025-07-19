<?php
class Conexion
{
    private string $host = "127.0.0.1";
    private string $dbname = "mina";
    private string $user = "root";
    private string $password = "";
    private ?PDO $conexion = null;

    public function conectar(): PDO
    {
        if ($this->conexion !== null) {
            return $this->conexion; // Evita múltiples conexiones
        }

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $this->conexion = new PDO($dsn, $this->user, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            return $this->conexion;
        } catch (PDOException $e) {
            if (!headers_sent()) {
                header('Content-Type: application/json; charset=UTF-8');
                http_response_code(500);
            }
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Error de conexión a la base de datos: ' . $e->getMessage()
            ]);
            exit;
        }
    }
}
