import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Mascotas() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: "", species: "", breed: "", age: "", weight: "" });
  const [editId, setEditId] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/pets/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/pets", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", species: "", breed: "", age: "", weight: "" });
      setEditId(null);
      getPets();
    } catch (err) {
      console.error("Error al guardar mascota", err);
    }
  };

  const handleEdit = (pet) => {
    setForm(pet);
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
    getPets();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Mascotas</h2>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Especie"
            value={form.species}
            onChange={(e) => setForm({ ...form, species: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Raza"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Edad"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Peso (kg)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Actualizar" : "Registrar"} mascota
        </button>
      </form>

      <table className="w-full text-left bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Especie</th>
            <th className="p-2">Raza</th>
            <th className="p-2">Edad</th>
            <th className="p-2">Peso</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id} className="border-t">
              <td className="p-2">{pet.name}</td>
              <td className="p-2">{pet.species}</td>
              <td className="p-2">{pet.breed}</td>
              <td className="p-2">{pet.age}</td>
              <td className="p-2">{pet.weight} kg</td>
              <td className="p-2 space-x-2">
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
  );
}
