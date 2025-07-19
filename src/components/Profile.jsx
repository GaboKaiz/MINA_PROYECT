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
                const { data } = await getUserData();
                console.log('Respuesta de getUserData:', data);

                if (data.estado === 'ok') {
                    const { nombre, correo } = data.data;
                    setNombre(nombre);
                    setCorreo(correo);

                    setPassword('');
                } else {
                    setError('Error al obtener datos del usuario: ' + data.mensaje);
                }
            } catch (err) {
                setError('Error de conexión: ' + err.message);
            }
        };

        fetchData();
    }, []);

    const toggleEdit = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));

        if (field === 'password' && isEditing.password) {
            setIsPasswordVisible(false);
        }
    };

    const handleUpdate = async () => {
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
        } catch (err) {
            console.error('Error de conexión:', err);
            setError('Error de conexión: ' + err.message);
        }
    };

    const renderInput = (label, value, setter, field, type = 'text') => (
        <div className={`mb-4 ${isEditing[field] ? '' : 'bg-gray-50'}`}>
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    readOnly={!isEditing[field]}
                    className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                />
                <button
                    type="button"
                    aria-label={`Editar ${field}`}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-600 hover:text-blue-500"
                    onClick={() => toggleEdit(field)}
                >
                    ✏️
                </button>
            </div>
        </div>
    );

    const renderPasswordInput = () => (
        <div className={`mb-4 ${isEditing.password ? '' : 'bg-gray-50'}`}>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={isEditing.password ? password : '••••••••'}
                    onChange={(e) => setPassword(e.target.value)}
                    readOnly={!isEditing.password}
                    className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                />
                <button
                    type="button"
                    aria-label="Mostrar u ocultar contraseña"
                    className={`absolute right-10 top-1/2 transform -translate-y-1/2 text-xl ${isPasswordVisible ? 'text-blue-500' : 'text-gray-600'}`}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    {isPasswordVisible ? '🙈' : '👁️'}
                </button>
                <button
                    type="button"
                    aria-label="Editar contraseña"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-600 hover:text-blue-500"
                    onClick={() => toggleEdit('password')}
                >
                    ✏️
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Mi Perfil</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {renderInput('Nombre Completo', nombre, setNombre, 'nombre')}
            {renderInput('Correo Electrónico', correo, setCorreo, 'correo', 'email')}
            {renderPasswordInput()}

            {(isEditing.nombre || isEditing.correo || isEditing.password) && (
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="mt-4 p-3 bg-blue-500 text-white rounded-md text-base hover:bg-blue-600 transform hover:scale-105 transition"
                >
                    Actualizar Datos
                </button>
            )}
        </div>
    );
}

export default Profile;
