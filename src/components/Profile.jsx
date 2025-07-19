import { useState, useEffect } from 'react';
import { getUserData, updateUser } from '../services/api';

function Profile() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEditing, setIsEditing] = useState({ nombre: false, correo: false, password: false });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserData();
                console.log('Respuesta de getUserData:', response.data);
                if (response.data.estado === 'ok') {
                    setNombre(response.data.datos.nombre);
                    setCorreo(response.data.datos.correo);
                    setPassword(response.data.datos.password);
                } else {
                    setError('Error al obtener datos del usuario: ' + response.data.mensaje);
                }
            } catch (error) {
                setError('Error de conexión: ' + error.message);
            }
        };
        fetchData();
    }, []);

    const toggleEdit = (field) => {
        console.log('Toggling edit for:', field, 'Current isEditing:', isEditing);
        setIsEditing((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
        if (field === 'password' && isEditing.password) {
            setPassword(password); // Mantener la contraseña actual al salir del modo edición
            setIsPasswordVisible(false);
        }
    };

    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleUpdate = async () => {
        const dataToSend = { nombre, correo, password };
        console.log('Enviando datos a updateUser:', dataToSend);
        try {
            const response = await updateUser(nombre, correo, password);
            console.log('Respuesta de updateUser:', response.data);
            if (response.data.estado === 'ok') {
                alert('Datos actualizados exitosamente');
                setIsEditing({ nombre: false, correo: false, password: false });
                setIsPasswordVisible(false);
                setError('');
            } else {
                setError('Error: ' + response.data.mensaje);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            setError('Error de conexión: ' + error.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Mi Perfil</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className={`mb-4 ${isEditing.nombre ? '' : 'bg-gray-50'}`}>
                <label className="block text-sm text-gray-600 mb-1">Nombre Completo</label>
                <div className="relative">
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        readOnly={!isEditing.nombre}
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-600 hover:text-blue-500"
                        onClick={() => toggleEdit('nombre')}
                    >
                        ✏️
                    </span>
                </div>
            </div>
            <div className={`mb-4 ${isEditing.correo ? '' : 'bg-gray-50'}`}>
                <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                <div className="relative">
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        readOnly={!isEditing.correo}
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-600 hover:text-blue-500"
                        onClick={() => toggleEdit('correo')}
                    >
                        ✏️
                    </span>
                </div>
            </div>
            <div className={`mb-4 ${isEditing.password ? '' : 'bg-gray-50'}`}>
                <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
                <div className="relative">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={isEditing.password ? password : '••••••••'}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        readOnly={!isEditing.password}
                    />
                    <span
                        className={`absolute right-10 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl ${isPasswordVisible ? 'text-blue-500' : 'text-gray-600'}`}
                        onClick={togglePassword}
                    >
                        {isPasswordVisible ? '🙈' : '👁️'}
                    </span>
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-600 hover:text-blue-500"
                        onClick={() => toggleEdit('password')}
                    >
                        ✏️
                    </span>
                </div>
            </div>
            {(isEditing.nombre || isEditing.correo || isEditing.password) && (
                <button
                    onClick={handleUpdate}
                    className="p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Actualizar Datos
                </button>
            )}
        </div>
    );
}

export default Profile;