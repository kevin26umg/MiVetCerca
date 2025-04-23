import { useState } from 'react';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'USUARIO' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registro exitoso');
    } catch (err) {
      alert('Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 mb-4 border rounded" />
        <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 mb-4 border rounded" />
        <input placeholder="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 mb-4 border rounded" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-2 mb-4 border rounded">
          <option value="USUARIO">Usuario</option>
          <option value="CLINICA">Clínica</option>
        </select>
        <button type="submit" className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">Registrarse</button>
      </form>
    </div>
  );
}
