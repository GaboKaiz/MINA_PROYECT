import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import TeamReport from '../components/TeamReport';
import DataReport from '../components/DataReport';
import GraphReport from '../components/GraphReport';
import MovementReport from '../components/MovementReport';
import { checkSession, logout } from '../services/api';

function Dashboard() {
    const [activeSection, setActiveSection] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await checkSession();
                if (response.data.estado !== 'ok') {
                    alert('Por favor, inicia sesión');
                    navigate('/login');
                }
            } catch (error) {
                alert('Error de conexión: ' + error.message);
                navigate('/login');
            }
        };
        verifySession();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('user');
            alert('Sesión cerrada exitosamente');
            navigate('/login');
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    const showSection = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar activeSection={activeSection} showSection={showSection} handleLogout={handleLogout} />
            <div className="flex-1 p-10 overflow-y-auto">
                <div className={`${activeSection === 'profile' ? 'block' : 'hidden'} section animate-slideInUp`}>
                    <Profile />
                </div>
                <div className={`${activeSection === 'team-report' ? 'block' : 'hidden'} section animate-slideInUp`}>
                    <TeamReport />
                </div>
                <div className={`${activeSection === 'data-report' ? 'block' : 'hidden'} section animate-slideInUp`}>
                    <DataReport />
                </div>
                <div className={`${activeSection === 'graph-report' ? 'block' : 'hidden'} section animate-slideInUp`}>
                    <GraphReport />
                </div>
                <div className={`${activeSection === 'movement-report' ? 'block' : 'hidden'} section animate-slideInUp`}>
                    <MovementReport />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;