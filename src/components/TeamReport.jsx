import { useState, useEffect } from 'react';
import { getEquipoData, addEquipo } from '../services/api';

function TeamReport() {
    const [equipos, setEquipos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [codigoEquipo, setCodigoEquipo] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEquipoData();
    }, []);

    const fetchEquipoData = async () => {
        setLoading(true);
        try {
            const response = await getEquipoData();
            if (response.data.estado === 'ok') {
                setEquipos(response.data.datos);
                setError('');
            } else {
                setError(response.data.mensaje || 'Error al obtener los datos');
            }
        } catch (error) {
            setError('Error de conexión: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEquipo = async () => {
        if (!descripcion.trim() || !codigoEquipo.trim() || !fechaInstalacion.trim()) {
            alert('Por favor, completa todos los campos');
            return;
        }

        try {
            const response = await addEquipo(descripcion, codigoEquipo, fechaInstalacion);
            if (response.data.estado === 'ok') {
                alert('Equipo agregado exitosamente');
                setDescripcion('');
                setCodigoEquipo('');
                setFechaInstalacion('');
                fetchEquipoData();
            } else {
                alert('Error: ' + response.data.mensaje);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Mi Equipo</h2>

            {/* Formulario */}
            <div className="mb-5 p-5 bg-gray-50 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Equipo</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Descripción</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej: Sensor Ambiental"
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Código del Equipo</label>
                        <input
                            type="text"
                            value={codigoEquipo}
                            onChange={(e) => setCodigoEquipo(e.target.value)}
                            placeholder="Ej: EQ001"
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Fecha de Instalación</label>
                        <input
                            type="date"
                            value={fechaInstalacion}
                            onChange={(e) => setFechaInstalacion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleAddEquipo}
                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition transform hover:scale-105"
                >
                    Agregar Equipo
                </button>
            </div>

            {/* Tabla de Equipos */}
            {loading ? (
                <p className="text-gray-600">Cargando equipos...</p>
            ) : error ? (
                <p className="text-red-500">⚠️ {error}</p>
            ) : equipos.length === 0 ? (
                <p className="text-gray-500 italic">No hay equipos registrados aún.</p>
            ) : (
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-blue-500 text-white text-left">
                            <th className="p-3">ID Equipo</th>
                            <th className="p-3">Descripción</th>
                            <th className="p-3">Código</th>
                            <th className="p-3">Fecha de Instalación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.map((equipo, index) => (
                            <tr
                                key={equipo.id_equipo}
                                className="border-b hover:bg-gray-100 transition duration-150 ease-in-out"
                                style={{ animationDelay: `${0.05 * index}s` }}
                            >
                                <td className="p-3">{equipo.id_equipo}</td>
                                <td className="p-3">{equipo.descripcion}</td>
                                <td className="p-3">{equipo.codigo_equipo}</td>
                                <td className="p-3">{equipo.fecha_instalacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeamReport;
