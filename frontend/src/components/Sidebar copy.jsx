export default function Sidebar() {
    return (
      <aside className="w-64 h-full bg-white shadow-md hidden md:block">
        <div className="p-6 text-xl font-bold text-blue-600 border-b">ClínicaApp</div>
        <nav className="p-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/mascotas" className="block text-gray-700 hover:text-blue-600">Mascotas</a>
          <a href="/citas" className="block text-gray-700 hover:text-blue-600">Citas</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Historial</a>
        </nav>
      </aside>
    );
  }
  