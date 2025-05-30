import { FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar({ name }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          <FiUser className="text-xl" />
        </div>
        <span className="text-gray-800 font-medium"> <span className="text-blue-600">{name}</span></span>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition"
        title="Cerrar sesión"
      >
        <FiLogOut className="text-xl" />
      </button>
    </header>
  );
}
