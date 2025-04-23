export default function PanelUsuario() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bienvenido {user.name}</h1>
        <p className="mt-2">Aquí iría tu panel para ver tus mascotas y citas médicas.</p>
      </div>
    );
  }
  