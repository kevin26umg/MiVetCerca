

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PanelClinica from './pages/PanelClinica';
import PanelUsuario from './pages/PanelUsuario';
import Mascotas from './pages/Mascotas';
import Citas from './pages/Citas';
import 'leaflet/dist/leaflet.css';
import MapaClinicas from './pages/MapaClinicas';

import './index.css'; 


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}

        <Route path="/" element={<MapaClinicas />} />
        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Register />} />
        <Route path="/panel-clinica" element={<PanelClinica />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />
        <Route path="/mascotas" element={<Mascotas />} />
       <Route path="/citas" element={<Citas />} />
        {/* <Route path="/mapa" element={<MapaClinicas />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
