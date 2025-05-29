import { useState } from 'react';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'USUARIO',
    clinicData: {
      name: '',
      address: '',
      phone: '',
      email: '',
      lat: '',
      lng: '',
      services: '',
      openHours: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("clinic_")) {
      const key = name.replace("clinic_", "");
      setForm((prev) => ({
        ...prev,
        clinicData: { ...prev.clinicData, [key]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };

      if (form.role === 'CLINICA') {
        payload.clinicData.services = form.clinicData.services
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        payload.clinicData.lat = parseFloat(payload.clinicData.lat);
        payload.clinicData.lng = parseFloat(payload.clinicData.lng);
      } else {
        delete payload.clinicData;
      }

      await api.post('/auth/register', payload);
      alert('Registro exitoso');
    } catch (err) {
      console.error(err);
      alert('Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>

        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
        <input name="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="USUARIO">Usuario</option>
          <option value="CLINICA">Clínica</option>
        </select>

        {form.role === 'CLINICA' && (
          <>
            <h3 className="text-xl font-semibold mb-2">Datos de la Clínica</h3>
            <input name="clinic_name" placeholder="Nombre de la clínica" value={form.clinicData.name} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_address" placeholder="Dirección" value={form.clinicData.address} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_phone" placeholder="Teléfono" value={form.clinicData.phone} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_email" placeholder="Correo de la clínica" value={form.clinicData.email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_lat" type="number" step="any" placeholder="Latitud" value={form.clinicData.lat} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_lng" type="number" step="any" placeholder="Longitud" value={form.clinicData.lng} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_services" placeholder="Servicios (separados por coma)" value={form.clinicData.services} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input name="clinic_openHours" placeholder="Horario de atención" value={form.clinicData.openHours} onChange={handleChange} className="w-full p-2 mb-4 border rounded" />
          </>
        )}

        <button type="submit" className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">Registrarse</button>
      </form>
    </div>
  );
}
