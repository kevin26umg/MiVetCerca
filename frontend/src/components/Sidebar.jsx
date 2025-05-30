import { FiHome, FiCalendar, FiHeart, FiUsers, FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Sidebar({ user }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-white to-blue-50 shadow-md hidden md:flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">MiVetCerca</div>
        <nav className="p-4 space-y-2 text-gray-700">
          <Link to="/panel-clinica" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            <FiHome className="text-blue-500" /> Dashboard
          </Link>
          <Link to="/mascotas" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            <FiUsers className="text-blue-500" /> Mascotas
          </Link>
          <Link to="/citas" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            <FiCalendar className="text-blue-500" /> Citas
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            <FiHeart className="text-blue-500" /> Historial
          </a>
        </nav>
      </div>

      {/* Perfil y logout */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiUser className="text-blue-500 text-xl" />
          <span className="text-sm text-gray-700 font-medium truncate w-28">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
          <FiLogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
