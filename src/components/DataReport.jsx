import { useState } from 'react';
import { getSensorData } from '../services/api';
import * as XLSX from 'xlsx';

function DataReport() {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [sensorData, setSensorData] = useState([]);
    const [currentFechaInicio, setCurrentFechaInicio] = useState(null);
    const [currentFechaFin, setCurrentFechaFin] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDateToDisplay = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return 'N/A';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const extractDateOnly = (timestamp) => {
        if (!timestamp) return null;
        return timestamp.split(' ')[0];
    };

    const fetchSensorData = async () => {
        if (!fechaInicio || !fechaFin) {
            alert('Por favor, seleccione ambas fechas (inicio y fin)');
            return;
        }
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        if (startDate > endDate) {
            alert('La fecha de inicio no puede ser mayor que la fecha de fin');
            return;
        }

        setLoading(true);
        try {
            const response = await getSensorData(fechaInicio, fechaFin);
            if (response.data.estado === 'ok') {
                setSensorData(response.data.datos);
                setCurrentFechaInicio(response.data.meta.fecha_inicio);
                setCurrentFechaFin(response.data.meta.fecha_fin);
            } else {
                alert('Error al obtener datos: ' + response.data.mensaje);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        setFechaInicio('');
        setFechaFin('');
        setSensorData([]);
        setCurrentFechaInicio(null);
        setCurrentFechaFin(null);
    };

    const exportToExcel = () => {
        if (sensorData.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const wsData = sensorData.map((row) => ({
            ID: row.id,
            'Dióxido de Nitrógeno': row.dioxido_nitrogeno,
            Temperatura: row.temperatura,
            Humedad: row.humedad,
            Pulso: row.pulso,
            X: row.x,
            Y: row.y,
            Z: row.z,
            GX: row.gx,
            GY: row.gy,
            GZ: row.gz,
            Fecha: formatDateToDisplay(extractDateOnly(row.fecha_hora)),
        }));

        const ws = XLSX.utils.json_to_sheet(wsData);
        const title =
            currentFechaInicio !== 'N/A' && currentFechaFin !== 'N/A'
                ? `Reporte de Sensores del ${formatDateToDisplay(currentFechaInicio)} al ${formatDateToDisplay(currentFechaFin)}`
                : 'Reporte de Sensores - Todos los Datos';
        XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });

        const colWidths = [
            { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
            { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
            { wch: 10 }, { wch: 15 },
        ];
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte Sensores');

        const fileName =
            currentFechaInicio !== 'N/A' && currentFechaFin !== 'N/A'
                ? `reporte_sensores_${currentFechaInicio.replace(/-/g, '')}_${currentFechaFin.replace(/-/g, '')}.xlsx`
                : 'reporte_sensores_todos.xlsx';

        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Reporte de Datos (Sensores Vitales de Mi Equipo)</h2>
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
                    <label className="block text-sm text-gray-600 mb-1">Fecha Fin:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    />
                </div>
                <button
                    onClick={fetchSensorData}
                    className="p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Filtrar
                </button>
                <button
                    onClick={clearFilter}
                    className="p-3 bg-red-500 text-white rounded-md text-base cursor-pointer hover:bg-red-600 transform hover:scale-105 transition"
                >
                    Limpiar Filtro
                </button>
            </div>
            <div className="text-sm text-gray-800 font-bold mb-2">
                {currentFechaInicio && currentFechaFin
                    ? `Mostrando datos del ${formatDateToDisplay(currentFechaInicio)} al ${formatDateToDisplay(currentFechaFin)}`
                    : 'Seleccione un rango de fechas para ver los datos'}
            </div>
            {loading && <div className="text-sm text-gray-600 mb-2">Cargando datos...</div>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Dióxido de Nitrógeno</th>
                        <th className="p-3 text-left">Temperatura</th>
                        <th className="p-3 text-left">Humedad</th>
                        <th className="p-3 text-left">Pulso</th>
                        <th className="p-3 text-left">X</th>
                        <th className="p-3 text-left">Y</th>
                        <th className="p-3 text-left">Z</th>
                        <th className="p-3 text-left">GX</th>
                        <th className="p-3 text-left">GY</th>
                        <th className="p-3 text-left">GZ</th>
                        <th className="p-3 text-left">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {sensorData.length === 0 ? (
                        <tr>
                            <td colSpan="12" className="p-3 text-center">
                                {currentFechaInicio ? 'No se encontraron datos en el rango seleccionado' : 'Seleccione un rango de fechas para ver los datos'}
                            </td>
                        </tr>
                    ) : (
                        sensorData.map((row, index) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50 transform transition" style={{ animationDelay: `${0.1 * (index % 5)}s` }}>
                                <td className="p-3">{row.id}</td>
                                <td className="p-3">{row.dioxido_nitrogeno}</td>
                                <td className="p-3">{row.temperatura}</td>
                                <td className="p-3">{row.humedad}</td>
                                <td className="p-3">{row.pulso}</td>
                                <td className="p-3">{row.x}</td>
                                <td className="p-3">{row.y}</td>
                                <td className="p-3">{row.z}</td>
                                <td className="p-3">{row.gx}</td>
                                <td className="p-3">{row.gy}</td>
                                <td className="p-3">{row.gz}</td>
                                <td className="p-3">{formatDateToDisplay(extractDateOnly(row.fecha_hora))}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="mt-5 flex gap-2 flex-wrap">
                <button
                    onClick={exportToExcel}
                    className="p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Exportar a Excel
                </button>
            </div>
        </div>
    );
}

export default DataReport;