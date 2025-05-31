import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center fixed top-0 w-full z-50">
      <Link to="/" className="text-xl font-bold text-blue-700 hover:underline">
        MiVetCerca
      </Link>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-700 hover:underline">Iniciar Sesión</Link>
        <Link to="/registro" className="text-blue-700 hover:underline">Registrarse</Link>
      </div>
    </nav>
  );
}
