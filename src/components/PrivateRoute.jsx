import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkSession } from '../services/api';

function PrivateRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await checkSession();
                if (response.data.estado === 'ok') {
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(response.data.usuario));
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        verifySession();
    }, []);

    if (isAuthenticated === null) {
        return <div>Cargando...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;