import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!nombre || !correo || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }
        if (!correo.includes('@') || !correo.includes('.')) {
            alert('Por favor, ingresa un correo electrónico válido');
            return;
        }
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const response = await register(nombre, correo, password);
            if (response.data.estado === 'ok') {
                alert('Registro exitoso. Por favor, inicia sesión.');
                navigate('/login');
            } else {
                alert(response.data.mensaje);
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 flex flex-col justify-center items-center p-10 bg-gray-100 animate-fadeIn">
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <img src="/JEREM_IA2/IMAGE/logo2.png" alt="Logo" className="h-12" />
                    <span className="text-2xl font-bold text-gray-800">JEREM-IA</span>
                </div>
                <div className="w-full max-w-md text-center">
                    <p className="text-sm text-gray-600 mb-2">Únete a nosotros</p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Regístrate en JEREM-IA</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre Completo"
                            className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Correo electrónico"
                            className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full p-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 transition"
                        />
                        <span
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl ${isPasswordVisible ? 'text-blue-500' : 'text-gray-600'}`}
                            onClick={togglePassword}
                        >
                            {isPasswordVisible ? '🙈' : '👁️'}
                        </span>
                    </div>
                    <button
                        onClick={handleRegister}
                        className="w-full p-3 bg-blue-500 text-white rounded-md text-base cursor-pointer hover:bg-blue-600 transform hover:scale-105 transition"
                    >
                        Regístrate
                    </button>
                    <div className="mt-4 text-sm text-gray-600">
                        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500 hover:underline">Inicia Sesión</Link>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-200 via-blue-100 to-pink-200 flex justify-center items-center animate-slideIn hidden md:flex">
                <img src="/JEREM_IA2/IMAGE/logo.png" alt="Imagen Animada" />
            </div>
        </div>
    );
}

export default Register;