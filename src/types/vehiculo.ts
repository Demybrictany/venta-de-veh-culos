export interface Vehiculo {
  idVehiculo: number | null;
  estado: boolean;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  precioDia: number;
}

export interface ApiMensaje {
  mensaje: string;
}
