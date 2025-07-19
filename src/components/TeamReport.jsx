import { useState, useEffect } from 'react';
import { getEquipoData, addEquipo } from '../services/api';

function TeamReport() {
    const [equipos, setEquipos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [codigoEquipo, setCodigoEquipo] = useState('');
    const [fechaInstalacion, setFechaInstalacion] = useState('');

    useEffect(() => {
        fetchEquipoData();
    }, []);

    const fetchEquipoData = async () => {
        try {
            const response = await getEquipoData();
            if (response.data.estado === 'ok') {
                setEquipos(response.data.datos);
            } else {
                alert('Error al obtener datos del equipo: ' + response.data.mensaje);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    const handleAddEquipo = async () => {
        if (!descripcion || !codigoEquipo || !fechaInstalacion) {
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
            <div className="mb-5 p-5 bg-gray-50 rounded-md shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Agregar Nuevo Equipo</h3>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Descripción</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ej: Sensor Ambiental"
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Código del Equipo</label>
                    <input
                        type="text"
                        value={codigoEquipo}
                        onChange={(e) => setCodigoEquipo(e.target.value)}
                        placeholder="Ej: EQ001"
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Fecha de Instalación</label>
                    <input
                        type="date"
                        value={fechaInstalacion}
                        onChange={(e) => setFechaInstalacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <button
                    onClick={handleAddEquipo}
                    className="p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Agregar Equipo
                </button>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-3 text-left">ID Equipo</th>
                        <th className="p-3 text-left">Descripción</th>
                        <th className="p-3 text-left">Código Equipo</th>
                        <th className="p-3 text-left">Fecha de Instalación</th>
                    </tr>
                </thead>
                <tbody>
                    {equipos.map((equipo, index) => (
                        <tr key={equipo.id_equipo} className="border-b hover:bg-gray-50 transform transition" style={{ animationDelay: `${0.1 * (index % 5)}s` }}>
                            <td className="p-3">{equipo.id_equipo}</td>
                            <td className="p-3">{equipo.descripcion}</td>
                            <td className="p-3">{equipo.codigo_equipo}</td>
                            <td className="p-3">{equipo.fecha_instalacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeamReport;