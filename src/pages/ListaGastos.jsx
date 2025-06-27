import { useEffect, useState } from "react";
import api from "../services/api";

function ListaGastos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoId, setVehiculoId] = useState("");
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/vehiculos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehiculos(res.data);
    };
    fetchVehiculos();
  }, []);

  const fetchGastos = async (vehiculoId) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/gastos/vehiculo/${vehiculoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGastos(res.data);
  };

  const handleVehiculoChange = (e) => {
    const id = e.target.value;
    setVehiculoId(id);
    if (id) {
      fetchGastos(id);
    } else {
      setGastos([]);
    }
  };

  return (
    <div className="container">
      <h2>Gastos por Vehículo</h2>
      <label>Seleccione un vehículo:</label>
      <select value={vehiculoId} onChange={handleVehiculoChange}>
        <option value="">-- Seleccione --</option>
        {vehiculos.map((v) => (
          <option key={v._id} value={v._id}>
            {v.placa} - {v.modelo}
          </option>
        ))}
      </select>

      {gastos.length > 0 ? (
        <>
          <ul style={{ marginTop: "1rem" }}>
            {gastos.map((g) => (
              <li key={g._id}>
                ${g.monto} – {g.descripcion} –{" "}
                {new Date(g.fecha).toLocaleDateString()}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Total de gastos: ${gastos.reduce((total, g) => total + g.monto, 0).toLocaleString()}
          </p>
        </>
      ) : vehiculoId ? (
        <p style={{ marginTop: "1rem" }}>
          No hay gastos registrados para este vehículo.
        </p>
      ) : null}
    </div>
  );
}

export default ListaGastos;
