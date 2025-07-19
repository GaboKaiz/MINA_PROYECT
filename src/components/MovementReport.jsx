import { useState } from 'react';
import Plotly from 'react-plotly.js';
import { getMovementDataForGraph } from '../services/api';

function MovementReport() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [movementData, setMovementData] = useState([]);
    const [movementFechaInicio, setMovementFechaInicio] = useState(null);
    const [movementFechaFin, setMovementFechaFin] = useState(null);

    const formatDateToDisplay = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return 'N/A';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const fetchMovementData = async () => {
        if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
            alert('Por favor, seleccione las fechas y horas (inicio y fin)');
            return;
        }
        const startDateTime = new Date(`${fechaInicio}T${horaInicio}`);
        const endDateTime = new Date(`${fechaFin}T${horaFin}`);
        if (startDateTime > endDateTime) {
            alert('La fecha y hora de inicio no pueden ser mayores que la fecha y hora de fin');
            return;
        }

        try {
            const response = await getMovementDataForGraph(fechaInicio, fechaFin, horaInicio, horaFin);
            if (response.data.estado === 'ok') {
                setMovementData(response.data.datos);
                setMovementFechaInicio(fechaInicio);
                setMovementFechaFin(fechaFin);
            } else {
                alert('Error al obtener datos: ' + response.data.mensaje);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    const clearFilter = () => {
        setFechaInicio('');
        setHoraInicio('');
        setFechaFin('');
        setHoraFin('');
        setMovementData([]);
        setMovementFechaInicio(null);
        setMovementFechaFin(null);
    };

    const plotData = movementData.length < 2 ? [] : [{
        x: movementData.map((row) => parseFloat(row.x)),
        y: movementData.map((row, index) => index),
        z: movementData.map((row) => parseFloat(row.z)),
        type: 'scatter3d',
        mode: 'lines+markers',
        line: { color: '#ffaa00', width: 4 },
        marker: { size: 6, color: '#ffaa00' },
        text: movementData.map((row) => `X: ${row.x}, Z: ${row.z}, Fecha: ${row.fecha_hora}`),
        hoverinfo: 'text',
        name: 'Trayectoria del vehículo',
    }];

    const layout = {
        title: 'Simulación 3D de Trayectoria',
        scene: {
            xaxis: { title: 'Eje X (Desplazamiento)' },
            yaxis: { title: 'Eje Y (Curva)' },
            zaxis: { title: 'Eje Z (Inclinación)' },
            bgcolor: 'rgb(255, 255, 255)',
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Gráfico de Movimientos</h2>
            <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Fecha Inicio:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Hora Inicio:</label>
                    <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Fecha Fin:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Hora Fin:</label>
                    <input
                        type="time"
                        value={horaFin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <button
                    onClick={fetchMovementData}
                    className="p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Filtrar y Graficar
                </button>
                <button
                    onClick={clearFilter}
                    className="p-3 bg-red-500 text-white rounded-md text-base cursor-pointer hover:bg-red-600 transform hover:scale-105 transition"
                >
                    Limpiar Filtro
                </button>
            </div>
            <div className="text-sm text-gray-800 font-bold mb-2">
                {movementFechaInicio && movementFechaFin
                    ? `Mostrando recorrido del ${formatDateToDisplay(movementFechaInicio)} ${horaInicio} al ${formatDateToDisplay(movementFechaFin)} ${horaFin}`
                    : 'Seleccione un rango de fechas y horas para ver el recorrido'}
            </div>
            <table className="w-full border-collapse mb-5">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">X</th>
                        <th className="p-3 text-left">Y</th>
                        <th className="p-3 text-left">Z</th>
                        <th className="p-3 text-left">Fecha y Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {movementData.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-3 text-center">
                                Seleccione un rango de fechas y horas para ver el recorrido
                            </td>
                        </tr>
                    ) : (
                        movementData.map((row, index) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50 transform transition" style={{ animationDelay: `${0.1 * (index % 5)}s` }}>
                                <td className="p-3">{row.id}</td>
                                <td className="p-3">{row.x}</td>
                                <td className="p-3">{row.y}</td>
                                <td className="p-3">{row.z}</td>
                                <td className="p-3">{row.fecha_hora}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md animate-chartBounceIn">
                <Plotly data={plotData} layout={layout} config={{ responsive: true, displayModeBar: true }} style={{ width: '100%', height: '500px' }} />
            </div>
        </div>
    );
}

export default MovementReport;  