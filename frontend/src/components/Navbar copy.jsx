export default function Navbar({ name }) {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Bienvenido, {name}</h1>
        <button
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </button>
      </header>
    );
  }
  