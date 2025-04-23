import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

  if (!user) return <div className="p-8 text-center">Cargando datos...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar name={user.name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-700">Panel de administración</h2>
          <p className="mt-2 text-gray-600">
            Aquí puedes gestionar tus mascotas, citas y el historial clínico.
          </p>
        </main>
      </div>
    </div>
  );
}
