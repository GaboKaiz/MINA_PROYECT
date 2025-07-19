import axios from "axios";

const API_URL = "http://localhost:8000/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (correo, password) => {
  return await api.post("Login.php", { correo, password });
};

export const register = async (nombre, correo, password) => {
  return await api.post("Registro.php", { nombre, correo, password });
};

export const logout = async () => {
  return await api.post("Logout.php");
};

export const checkSession = async () => {
  return await api.get("CheckSession.php");
};

export const getUserData = async () => {
  return await api.get("Obtener_Usuario.php");
};

export const updateUser = async (nombre, correo, password) => {
  return await api.post("Actualizar_Usuario.php", { nombre, correo, password });
};

export const getEquipoData = async () => {
  return await api.get("Obtener_Equipo.php");
};

export const addEquipo = async (
  descripcion,
  codigo_equipo,
  fecha_instalacion
) => {
  return await api.post("Agregar_Equipo.php", {
    descripcion,
    codigo_equipo,
    fecha_instalacion,
  });
};

export const getSensorData = async (fecha_inicio, fecha_fin) => {
  return await api.post("FilterSensorDataByDate.php", {
    fecha_inicio,
    fecha_fin,
  });
};

export const getVitalSignsForGraph = async (fecha_inicio, fecha_fin) => {
  return await api.post("GetVitalSignsForGraph.php", {
    fecha_inicio,
    fecha_fin,
  });
};

export const getMovementDataForGraph = async (
  fecha_inicio,
  fecha_fin,
  hora_inicio,
  hora_fin
) => {
  return await api.post("GetMovementDataForGraph.php", {
    fecha_inicio,
    fecha_fin,
    hora_inicio,
    hora_fin,
  });
};

export const saveVitalSigns = async (data) => {
  return await api.post("../Sensores_Vitales.php", data);
};

export default api;
