import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

export default function Citas() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ petId: "", date: "", description: "" });
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const getAppointments = async () => {
    try {
      const res = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error al obtener citas", err);
    }
  };

  const getPets = async () => {
    if (!user) return;

    try {
      const endpoint = user.role === "CLINICA" ? "/pets/all" : "/pets";
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(res.data);
    } catch (err) {
      console.error("Error al obtener mascotas", err);
    }
  };

  const createAppointment = async () => {
    if (!form.petId || !form.date) {
      alert("Debes seleccionar una mascota y una fecha.");
      return;
    }

    try {
      await api.post(
        "/appointments",
        {
          petId: Number(form.petId),
          date: form.date,
          description: form.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({ petId: "", date: "", description: "" });
      getAppointments();
    } catch (err) {
      console.error("Error al crear cita:", err.response?.data || err.message);
      alert("Error al crear cita: " + (err.response?.data?.error || err.message));
    }
  };

  const confirmAppointment = async (id) => {
    try {
      await api.patch(`/appointments/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAppointments();
    } catch (err) {
      console.error("Error al confirmar cita", err);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAppointments();
    } catch (err) {
      console.error("Error al cancelar cita", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getAppointments();
      getPets();
    }
  }, [user]);

  if (!user) return <div className="p-8 text-center text-gray-600">Cargando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-screen bg-gradient-to-br from-white to-blue-50"
    >
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar name={user.name} />
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Citas</h2>

          {user.role === "CLINICA" && (
            <div className="bg-white p-6 rounded-xl shadow space-y-4 mb-8">
              <h3 className="text-lg font-semibold">Crear nueva cita</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={form.petId}
                  onChange={(e) => setForm({ ...form, petId: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecciona una mascota</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone || "sin teléfono"})
                    </option>
                  ))}
                </select>

                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <input
                  placeholder="Descripción"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={createAppointment}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Crear cita
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-auto">
            <table className="min-w-full text-left">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="p-3">Mascota</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((cita) => (
                  <tr key={cita.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{cita.pet?.name || "—"}</td>
                    <td className="p-3">{new Date(cita.date).toLocaleString()}</td>
                    <td className="p-3">{cita.description || "—"}</td>
                    <td className="p-3">
                      {cita.cancelled
                        ? "❌ Cancelada"
                        : cita.confirmed
                        ? "✅ Confirmada"
                        : "🕒 Pendiente"}
                    </td>
                    <td className="p-3 space-x-2">
                      {!cita.confirmed && !cita.cancelled && user.role === "CLINICA" && (
                        <button
                          onClick={() => confirmAppointment(cita.id)}
                          className="text-green-600 hover:underline"
                        >
                          Confirmar
                        </button>
                      )}
                      {!cita.cancelled && (
                        <button
                          onClick={() => cancelAppointment(cita.id)}
                          className="text-red-600 hover:underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
