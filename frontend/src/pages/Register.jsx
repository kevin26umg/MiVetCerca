import { useState } from 'react';
import api from '../api/axios';
import {
  FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiClock, FiList, FiGlobe
} from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from '../components/Navbar-main';

const InputWithIcon = ({ iconElement, ...props }) => (
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
      {iconElement}
    </span>
    <input
      {...props}
      className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/50 text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />
  </div>
);

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    phone: '', // ✅ Campo agregado
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
      const payload = {
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
        phone: form.phone,
        clinicData: form.clinicData
      };

      if (form.role === 'CLINICA') {
        payload.clinicData.services = Array.isArray(form.clinicData.services)
          ? form.clinicData.services
          : form.clinicData.services.split(',').map((s) => s.trim()).filter(Boolean);

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
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-400 px-4"
    >
      <>
        <Navbar />
        <div></div>
      </>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl shadow-2xl p-10 text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center drop-shadow">Crear Cuenta</h2>

        <InputWithIcon iconElement={<FiUser />} name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <InputWithIcon iconElement={<FiMail />} name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
        <InputWithIcon iconElement={<FiLock />} name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
        <InputWithIcon iconElement={<FiPhone />} name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} /> {/* ✅ Nuevo input */}

        <div className="relative mb-6">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full pl-4 pr-3 py-3 rounded-xl bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="USUARIO">Usuario</option>
            <option value="CLINICA">Clínica</option>
          </select>
        </div>

        {form.role === 'CLINICA' && (
          <>
            <h3 className="text-xl font-semibold mb-3 text-white/90">Datos de la Clínica</h3>

            <InputWithIcon iconElement={<FiUser />} name="clinic_name" placeholder="Nombre de la clínica" value={form.clinicData.name} onChange={handleChange} />
            <InputWithIcon iconElement={<FiMapPin />} name="clinic_address" placeholder="Dirección" value={form.clinicData.address} onChange={handleChange} />
            <InputWithIcon iconElement={<FiPhone />} name="clinic_phone" placeholder="Teléfono" value={form.clinicData.phone} onChange={handleChange} />
            <InputWithIcon iconElement={<FiMail />} name="clinic_email" placeholder="Correo de la clínica" value={form.clinicData.email} onChange={handleChange} />
            <InputWithIcon iconElement={<FiGlobe />} name="clinic_lat" type="number" step="any" placeholder="Latitud" value={form.clinicData.lat} onChange={handleChange} />
            <InputWithIcon iconElement={<FiGlobe />} name="clinic_lng" type="number" step="any" placeholder="Longitud" value={form.clinicData.lng} onChange={handleChange} />
            <InputWithIcon iconElement={<FiList />} name="clinic_services" placeholder="Servicios (separados por coma)" value={form.clinicData.services} onChange={handleChange} />
            <InputWithIcon iconElement={<FiClock />} name="clinic_openHours" placeholder="Horario de atención" value={form.clinicData.openHours} onChange={handleChange} />
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition-all font-semibold shadow-lg"
        >
          Registrarse
        </button>
      </form>
    </motion.div>
  );
}
