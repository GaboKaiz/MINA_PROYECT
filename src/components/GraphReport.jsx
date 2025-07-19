import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getVitalSignsForGraph } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

function GraphReport() {
    const [vitalSignsData, setVitalSignsData] = useState([]);
    const [sensor, setSensor] = useState('dioxido_nitrogeno');
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getVitalSignsForGraph();
                if (response.data.estado === 'ok') {
                    setVitalSignsData(response.data.datos);
                } else {
                    alert('Error al obtener datos: ' + response.data.mensaje);
                }
            } catch (error) {
                alert('Error de conexión: ' + error.message);
            }
        };
        fetchData();
    }, []);

    const data = {
        labels: vitalSignsData.slice(0, 5).map((row) => row.fecha_hora.split(' ')[0]),
        datasets: [
            {
                label: `${sensor.charAt(0).toUpperCase() + sensor.slice(1).replace('_', ' ')} (${{
                    dioxido_nitrogeno: 'ppm',
                    temperatura: '°C',
                    humedad: '%',
                    pulso: 'bpm',
                }[sensor] || ''})`,
                data: vitalSignsData.slice(0, 5).map((row) => row[sensor]),
                borderColor: chartType === 'pie' || chartType === 'doughnut' ? ['#4285f4', '#34c759', '#fbbc05', '#ea4335', '#00c4b4'] : '#4285f4',
                backgroundColor: chartType === 'pie' || chartType === 'doughnut'
                    ? ['#4285f480', '#34c75980', '#fbbc0580', '#ea433580', '#00c4b480']
                    : chartType === 'area' ? 'rgba(66, 133, 244, 0.4)' : 'rgba(66, 133, 244, 0.2)',
                fill: chartType === 'area' || chartType === 'line',
                tension: chartType === 'area' || chartType === 'line' ? 0.4 : 0,
                borderWidth: 2,
                pointRadius: chartType === 'pie' || chartType === 'doughnut' ? 0 : 5,
                pointHoverRadius: chartType === 'pie' || chartType === 'doughnut' ? 0 : 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: chartType === 'pie' || chartType === 'doughnut', position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${{
                        dioxido_nitrogeno: 'ppm',
                        temperatura: '°C',
                        humedad: '%',
                        pulso: 'bpm',
                    }[sensor] || ''}`,
                },
            },
        },
        animation: { duration: 1500, easing: chartType === 'pie' || chartType === 'doughnut' ? 'easeInOutQuad' : 'easeOutBounce' },
        scales: chartType === 'pie' || chartType === 'doughnut' ? {} : {
            y: {
                beginAtZero: true,
                title: { display: true, text: `Valor (${{ dioxido_nitrogeno: 'ppm', temperatura: '°C', humedad: '%', pulso: 'bpm' }[sensor] || ''})` },
                grid: { color: '#e0e0e0' },
            },
            x: { title: { display: true, text: 'Fecha' }, grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45 } },
        },
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Reporte Gráfico Filtrado por Sensor</h2>
            <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Seleccionar Sensor:</label>
                    <select
                        value={sensor}
                        onChange={(e) => setSensor(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    >
                        <option value="dioxido_nitrogeno">Dióxido de Nitrógeno</option>
                        <option value="temperatura">Temperatura</option>
                        <option value="humedad">Humedad</option>
                        <option value="pulso">Pulso</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Tipo de Gráfico:</label>
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                    >
                        <option value="line">Línea</option>
                        <option value="bar">Barras</option>
                        <option value="pie">Circular (Pie)</option>
                        <option value="area">Área</option>
                        <option value="doughnut">Doughnut</option>
                    </select>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md animate-chartBounceIn">
                {chartType === 'bar' && <Bar data={data} options={options} />}
                {chartType === 'line' && <Line data={data} options={options} />}
                {chartType === 'pie' && <Pie data={data} options={options} />}
                {chartType === 'area' && <Line data={data} options={options} />}
                {chartType === 'doughnut' && <Doughnut data={data} options={options} />}
            </div>
        </div>
    );
}

export default GraphReport;