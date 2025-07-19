function Sidebar({ activeSection, showSection, handleLogout }) {
    const sections = [
        { id: 'profile', label: 'Mi Perfil' },
        { id: 'team-report', label: 'Mi Equipo' },
        { id: 'data-report', label: 'Reporte de Datos' },
        { id: 'graph-report', label: 'Reporte Gráfico' },
        { id: 'movement-report', label: 'Gráfico de Movimientos' },
    ];

    return (
        <div className="w-64 bg-gradient-to-br from-blue-200 to-blue-100 p-5 flex flex-col gap-4 animate-slideInLeft">
            <div className="flex items-center gap-2 mb-8">
                <img src="/JEREM_IA2/IMAGE/logo2.png" alt="Logo" className="h-12" />
                <span className="text-2xl font-bold text-gray-800">JEREM-IA</span>
            </div>

            {sections.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => showSection(id)}
                    className={`text-left p-4 rounded-md transition transform hover:translate-x-2 ${
                        activeSection === id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-800 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    {label}
                </button>
            ))}

            <button
                onClick={handleLogout}
                className="mt-auto p-4 text-left text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Sidebar;
