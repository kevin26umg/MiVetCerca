

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PanelClinica from './pages/PanelClinica';
import PanelUsuario from './pages/PanelUsuario';
import Mascotas from './pages/Mascotas';

import './index.css'; 


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/panel-clinica" element={<PanelClinica />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />
        <Route path="/mascotas" element={<Mascotas />} />

      </Routes>
    </BrowserRouter>
  );
}
