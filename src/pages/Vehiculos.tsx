import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import axios from "axios";
import {
  listarVehiculosActivos,
  crearVehiculo,
  actualizarVehiculo,
  anularVehiculo,
} from "../services/vehiculoServices";
import type { Vehiculo } from "../types/vehiculo";

const formInicial: Vehiculo = {
  idVehiculo: null,
  estado: true,
  placa: "",
  marca: "",
  modelo: "",
  color: "",
  precioDia: 0,
};

const obtenerMensajeError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.mensaje ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
};

const obtenerVehiculosActivos = async (): Promise<Vehiculo[]> => {
  const respuesta = await listarVehiculosActivos();
  if (!Array.isArray(respuesta.data)) {
    throw new Error(
      "La API no devolvió una lista de vehículos. Revisa VITE_API_URL y el endpoint del backend.",
    );
  }
  return respuesta.data;
};

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [form, setForm] = useState<Vehiculo>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorCarga, setErrorCarga] = useState("");

  const cargarVehiculos = useCallback(async () => {
    try {
      setVehiculos(await obtenerVehiculosActivos());
      setErrorCarga("");
    } catch (error) {
      setErrorCarga(obtenerMensajeError(error));
      console.error("Error al listar vehiculos", error);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    void obtenerVehiculosActivos().then(
      (vehiculos) => {
        if (cancelado) return;
        setVehiculos(vehiculos);
        setErrorCarga("");
      },
      (error: unknown) => {
        if (cancelado) return;
        setErrorCarga(obtenerMensajeError(error));
        console.error("Error al listar vehiculos", error);
      },
    );
    return () => {
      cancelado = true;
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precioDia" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { placa, marca, modelo, color, precioDia } = form;
      const payload = { placa, marca, modelo, color, precioDia };

      if (modoEdicion && form.idVehiculo !== null) {
        await actualizarVehiculo(form.idVehiculo, payload);
        setMensaje("Vehiculo actualizado correctamente");
      } else {
        await crearVehiculo(payload);
        setMensaje("Vehiculo creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al guardar vehiculo", error);
    }
  };

  const handleModificar = (vehiculo: Vehiculo) => {
    setForm(vehiculo);
    setModoEdicion(true);
  };

  const handleAnular = async (idVehiculo: number) => {
    const confirmar = window.confirm("¿Seguro que deseas anular este vehiculo?");
    if (!confirmar) return;
    try {
      await anularVehiculo(idVehiculo);
      setMensaje("Vehiculo anulado correctamente");
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al anular el vehiculo", error);
    }
  };

  return (
    <div className="page-card">
      <header className="page-header">
        <h1>Christopher Diego Martínez Hernández</h1>
        <h3>Carnet: 0904-25-19857</h3>
      </header>

      <h2 className="section-title">Ingresar / Modificar Vehículos</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form className="vehiculo-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="placa">Placa</label>
          <input type="text" id="placa" name="placa" value={form.placa} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="marca">Marca</label>
          <input type="text" id="marca" name="marca" value={form.marca} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="modelo">Modelo</label>
          <input type="text" id="modelo" name="modelo" value={form.modelo} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="color">Color</label>
          <input type="text" id="color" name="color" value={form.color} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="precioDia">Precio por día</label>
          <input type="number" id="precioDia" name="precioDia" value={form.precioDia} onChange={handleChange} />
        </div>
        <button className="btn-primary" type="submit">Guardar</button>
      </form>

      <h2 className="section-title">Listado de Vehículos</h2>
      {errorCarga && <p className="mensaje" role="alert">{errorCarga}</p>}
      <div className="vehiculos-table-wrap">
        <table className="vehiculos-table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Precio/Día</th>
              <th>Modificar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.idVehiculo}>
                <td>{vehiculo.placa}</td>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.color}</td>
                <td>{vehiculo.precioDia.toFixed(2)}</td>
                <td>
                  <button className="btn-modificar" onClick={() => handleModificar(vehiculo)}>
                    Modificar
                  </button>
                </td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() =>
                      vehiculo.idVehiculo !== null && handleAnular(vehiculo.idVehiculo)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vehiculos;
