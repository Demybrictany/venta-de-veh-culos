import api from "../axios";
import type { Vehiculo } from "../types/vehiculo";

export const listarVehiculosActivos = () =>
  api.get<Vehiculo[]>("/vehiculos/mostrarActivos");

export const crearVehiculo = (
  data: Omit<Vehiculo, "idVehiculo" | "estado">,
) => api.post<Vehiculo>("/vehiculos", data);

export const actualizarVehiculo = (
  id: number,
  data: Omit<Vehiculo, "idVehiculo" | "estado">,
) => api.put<Vehiculo>(`/vehiculos/${id}`, data);

export const anularVehiculo = (id: number) =>
  api.put<Vehiculo>(`/vehiculos/anular/${id}`);
