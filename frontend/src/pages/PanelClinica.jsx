import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";


export default function PanelClinica() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/";

    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        window.location.href = "/";
      });
  }, []);

  if (!user) return <div className="p-8 text-center text-gray-600">Cargando datos...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
     className="flex h-screen bg-gradient-to-br from-white to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar name={user.name} />
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel de administración</h2>
          <p className="text-gray-600">
            Aquí puedes gestionar tus mascotas, citas y el historial clínico.
          </p>
        </main>
      </div>
    </motion.div>
  );
}
