import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

export default function Mascotas() {
  const [pets, setPets] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    phone: "",
    clinicId: ""
  });
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const getPets = async () => {
    try {
      const res = await api.get("/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(res.data);
    } catch (err) {
      console.error("Error al obtener mascotas", err);
    }
  };

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

  const getClinics = async () => {
    try {
      const res = await api.get("/clinics");
      setClinics(res.data);
    } catch (err) {
      console.error("Error al obtener clínicas", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        name: form.name,
        phone: form.phone,
      };

      if (user.role === "USUARIO") {
        Object.assign(dataToSend, {
          species: form.species,
          breed: form.breed,
          age: Number(form.age),
          weight: Number(form.weight),
          clinicId: form.clinicId ? Number(form.clinicId) : null,
        });
      }

if (user.role === "CLINICA") {
  Object.assign(dataToSend, {
    species: form.species || null,
    breed: form.breed || null,
    age: form.age ? Number(form.age) : null,
    weight: form.weight ? Number(form.weight) : null,
    clinicId: user.clinicId,
  });
}


      if (editId) {
        await api.put(`/pets/${editId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/pets", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        name: "",
        species: "",
        breed: "",
        age: "",
        weight: "",
        phone: "",
        clinicId: ""
      });
      setEditId(null);
      getPets();
    } catch (err) {
      console.error("Error al guardar mascota", err);
    }
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      age: pet.age || "",
      weight: pet.weight || "",
      phone: pet.phone || "",
      clinicId: pet.clinicId || ""
    });
    setEditId(pet.id);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar mascota?")) {
      try {
        await api.delete(`/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        getPets();
      } catch (err) {
        console.error("Error al eliminar mascota", err);
      }
    }
  };

  useEffect(() => {
    getUser();
    getPets();
    getClinics();
  }, []);

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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Mascotas</h2>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              />

              <input
                placeholder="Teléfono del dueño"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                required
              />

              {user.role === "USUARIO" && (
                <>
                  <input
                    placeholder="Especie"
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    required
                  />
                  <input
                    placeholder="Raza"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="number"
                    placeholder="Edad"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="number"
                    placeholder="Peso (kg)"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  <select
                    value={form.clinicId}
                    onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    required
                  >
                    <option value="">Seleccionar clínica</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                    ))}
                  </select>
                </>
              )}

{user.role === "CLINICA" && (
  <>
    <input
      placeholder="Especie"
      value={form.species}
      onChange={(e) => setForm({ ...form, species: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
      required
    />
    <input
      placeholder="Raza"
      value={form.breed}
      onChange={(e) => setForm({ ...form, breed: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
    />
    <input
      type="number"
      placeholder="Edad"
      value={form.age}
      onChange={(e) => setForm({ ...form, age: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
    />
    <input
      type="number"
      placeholder="Peso (kg)"
      value={form.weight}
      onChange={(e) => setForm({ ...form, weight: e.target.value })}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
    />
  </>
)}

            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editId ? "Actualizar" : "Registrar"} mascota
            </button>
          </form>

          <div className="bg-white rounded-xl shadow overflow-auto">
            <table className="min-w-full text-left">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Especie</th>
                  <th className="p-3">Raza</th>
                  <th className="p-3">Edad</th>
                  <th className="p-3">Peso</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{pet.name}</td>
                    <td className="p-3">{pet.species}</td>
                    <td className="p-3">{pet.breed}</td>
                    <td className="p-3">{pet.age}</td>
                    <td className="p-3">{pet.weight} kg</td>
                    <td className="p-3">{pet.phone}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
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
