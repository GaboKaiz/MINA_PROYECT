function Sidebar({ activeSection, showSection, handleLogout }) {
    return (
        <div className="w-64 bg-gradient-to-br from-blue-200 to-blue-100 p-5 flex flex-col gap-4 animate-slideInLeft">
            <div className="flex items-center gap-2 mb-8">
                <img src="/JEREM_IA2/IMAGE/logo2.png" alt="Logo" className="h-12" />
                <span className="text-2xl font-bold text-gray-800">JEREM-IA</span>
            </div>
            <a
                href="#"
                className={`p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition ${activeSection === 'profile' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => showSection('profile')}
            >
                Mi Perfil
            </a>
            <a
                href="#"
                className={`p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition ${activeSection === 'team-report' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => showSection('team-report')}
            >
                Mi Equipo
            </a>
            <a
                href="#"
                className={`p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition ${activeSection === 'data-report' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => showSection('data-report')}
            >
                Reporte de Datos
            </a>
            <a
                href="#"
                className={`p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition ${activeSection === 'graph-report' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => showSection('graph-report')}
            >
                Reporte Gráfico
            </a>
            <a
                href="#"
                className={`p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition ${activeSection === 'movement-report' ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => showSection('movement-report')}
            >
                Gráfico de Movimientos
            </a>
            <a
                href="#"
                className="p-4 text-gray-800 rounded-md hover:bg-blue-500 hover:text-white transform hover:translate-x-2 transition mt-auto"
                onClick={handleLogout}
            >
                Cerrar Sesión
            </a>
        </div>
    );
}

export default Sidebar;