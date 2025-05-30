import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from '../components/Navbar-main';

const InputWithIcon = ({ iconElement, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
      {iconElement}
    </span>
    <input
      {...props}
      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/60 border border-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-600"
    />
  </div>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Debes ingresar tu correo y contraseña");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(user.role === "CLINICA" ? "/panel-clinica" : "/panel-usuario");
    } catch {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-200 to-blue-300 px-4"
    >

        <>
            <Navbar />
            <div > {/* Padding top para que no tape el mapa */}
              {/* Aquí tu componente de mapa */}
            </div>
          </>
          
      <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6 drop-shadow">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputWithIcon
            iconElement={<FiMail />}
            type="email"
            name="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputWithIcon
            iconElement={<FiLock />}
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-center text-gray-800 mt-6">
          ¿No tenés cuenta?{" "}
          <a href="/registro" className="text-cyan-700 hover:underline font-medium">
            Registrate
          </a>
        </p>
      </div>
    </motion.div>
  );
}
