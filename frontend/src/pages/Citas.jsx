import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState("");
  const [clinicaId, setClinicaId] = useState("");

  const getCitas = async () => {
    try {
      const res = await api.get("/appointments");
      setCitas(res.data);
    } catch (err) {
      console.error("Error al obtener citas", err);
    }
  };

  const crearCita = async (e) => {
    e.preventDefault();

    if (!fecha || !clinicaId) {
      alert("Debes ingresar la fecha y la clínica");
      return;
    }

    try {
     const fechaISO = new Date(fecha).toISOString();
await api.post("/appointments", {
  date: fechaISO,
  clinicId: Number(clinicaId),
});

      setFecha("");
      setClinicaId("");
      getCitas();
    } catch (err) {
      console.error("Error al crear la cita", err);
      alert("Error al crear la cita");
    }
  };

  const cancelarCita = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      getCitas();
    } catch (err) {
      console.error("Error al cancelar cita", err);
      alert("Error al cancelar cita");
    }
  };

  useEffect(() => {
    getCitas();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Mis Citas</h2>

      <form onSubmit={crearCita} className="space-y-4 mb-8">
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="ID de la clínica"
          value={clinicaId}
          onChange={(e) => setClinicaId(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Cita
        </button>
      </form>

      <ul className="space-y-4">
        {citas.map((cita) => (
          <li key={cita.id} className="border p-4 rounded shadow">
            <p><strong>Fecha:</strong> {new Date(cita.date).toLocaleString()}</p>
            <p><strong>Clínica:</strong> {cita.clinic?.name || `ID ${cita.clinicId}`}</p>
            <p><strong>Estado:</strong> {cita.cancelled ? "Cancelada" : "Activa"}</p>
            {!cita.cancelled && (
              <button
                onClick={() => cancelarCita(cita.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
