import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiSearch } from "react-icons/fi";


function CentrarMapa({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

function BotonCentrar({ position }) {
  const map = useMap();
  const handleClick = () => {
    if (position) {
      map.setView(position, 16);
    }
  };
  return (
    <button 
    style={{ zIndex: 500 }}
      onClick={handleClick}
      className="absolute bottom-4 left-4 z-50 bg-white border shadow px-4 py-2 rounded-full hover:bg-gray-100 flex items-center gap-2 z-50"
    >
      <img src="https://img.icons8.com/?size=100&id=4cQ415HSv4Xx&format=png&color=000000" alt="Ubicación" className="w-6 h-6" />
    </button>
  );
}

export default function MapaClinicas() {
  const [clinicas, setClinicas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clinicasFiltradas, setClinicasFiltradas] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const markerRefs = useRef({});
  const mapRef = useRef();
  const listaRef = useRef();

  useEffect(() => {
    api.get('/clinics')
      .then(res => {
        setClinicas(res.data);
        setClinicasFiltradas(res.data);
      })
      .catch(err => console.error("Error cargando clínicas:", err));
  }, []);

  useEffect(() => {
    const search = busqueda.toLowerCase().trim();
    let filtradas = clinicas;

    if (search !== '') {
      filtradas = clinicas.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.address.toLowerCase().includes(search) ||
        c.services.join(',').toLowerCase().includes(search)
      );
    } else if (userLocation) {
      filtradas = [...clinicas]
        .map(c => ({
          ...c,
          distancia: haversine(userLocation.lat, userLocation.lng, c.lat, c.lng)
        }))
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 10);
    }

    if (userLocation) {
      filtradas = filtradas.map(c => ({
        ...c,
        distancia: haversine(userLocation.lat, userLocation.lng, c.lat, c.lng)
      }));
    }

    setClinicasFiltradas(filtradas);
  }, [busqueda, clinicas, userLocation]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
      },
      (err) => {
        console.warn("Permiso de geolocalización denegado", err);
      }
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (listaRef.current && !listaRef.current.contains(e.target)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const toRad = (value) => (value * Math.PI) / 180;

  const handleSeleccionarClinica = (clinica) => {
    const ref = markerRefs.current[clinica.id];
    if (ref) {
      ref.openPopup();
      ref._map.setView([clinica.lat, clinica.lng], 16);
      setMostrarLista(false);
    }
  };

  const handleFocus = () => {
    setMostrarLista(true);
  };

  const idsFiltrados = busqueda.trim() ? new Set(clinicasFiltradas.map(c => c.id)) : new Set();

  return (
    <div className="flex flex-col h-screen relative bg-transparent">
        


    <div className="left-1/2 transform -translate-x-1/2 w-[90%] max-w-xlp-2 m-2 bg-gradient-to-r from-blue-400/40 to-cyan-300/40 backdrop-blur-md shadow-md z-10 absolute rounded-xl" ref={listaRef}>
    <div className="relative bg-transparent">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
      <input
        type="text"
        placeholder="Buscar clínica, dirección o servicio..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onFocus={handleFocus}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
      />

        {mostrarLista && (
          <ul className="absolute w-full bg-white mt-1 border rounded shadow max-h-80 overflow-y-auto z-50">
            {clinicasFiltradas.map(clinica => (
              <li
                key={clinica.id}
                onClick={() => handleSeleccionarClinica(clinica)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b flex flex-col"
              >
                <span className="font-semibold text-green-700">{clinica.name}</span>
                <span className="text-sm text-gray-600">{clinica.address}</span>
                <span className="text-xs text-gray-400 italic">{clinica.services.join(', ')}</span>
                <span className="text-xs text-blue-500">
                  {clinica.distancia?.toFixed(2)} km
                </span>
              </li>
            ))}
            {clinicasFiltradas.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">No se encontraron clínicas</li>
            )}
          </ul>
        )}


      </div>
</div>
      <div className="flex-1 z-0">
        <MapContainer
          zoom={12}
            zoomControl={false}
          scrollWheelZoom={true}
          className="h-full w-full"
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
           
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && <CentrarMapa position={[userLocation.lat, userLocation.lng]} />}
          {userLocation && <BotonCentrar position={userLocation} />}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={L.icon({
              iconUrl: "https://img.icons8.com/?size=100&id=4cQ415HSv4Xx&format=png&color=000000",
              iconSize: [40, 40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -30]
            })}>
              <Popup>Estás aquí</Popup>
            </Marker>
          )}

          {clinicas.map(clinica => (
            <Marker
              icon={L.icon({
                iconUrl: "https://img.icons8.com/?size=100&id=FAPxBDkKDMzG&format=png&color=000000",
                iconSize: [40, 40],
                iconAnchor: [16, 32],
                popupAnchor: [0, -30]
              })}
              key={clinica.id}
              position={[clinica.lat, clinica.lng]}
              ref={(ref) => (markerRefs.current[clinica.id] = ref)}
            >
              <Popup>
                <strong>{clinica.name}</strong><br />
                {clinica.address}<br />
                <em>{clinica.services.join(', ')}</em>
              </Popup>
            </Marker>
          ))}

          {busqueda.trim() && clinicas.map(clinica => (
            idsFiltrados.has(clinica.id)
          ))}
        </MapContainer>

        
      </div>
    </div>
  );
}
