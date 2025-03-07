import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Définition de l'icône personnalisée pour les panneaux publicitaires
const customIcon = new Icon({
    iconUrl: "/pin-icon.png", // Chemin de l'icône (assurez-vous qu'elle est bien dans "public/")
    iconSize: [40, 40], // Taille du pin
    iconAnchor: [20, 40], // Ajustement du point d'ancrage
  });
  

// Interface pour représenter un panneau
interface Panneau {
  id: number;
  latitude: number;
  longitude: number;
  adresse: string;
  type: string;
  dimensions: string;
  prix: number;
  regie: string;
}

const MapComponent = () => {
  const center: LatLngExpression = [5.348, -4.027]; // Point de départ sur la carte
  const [panneaux, setPanneaux] = useState<Panneau[]>([]);

  // Récupérer les panneaux depuis l’API au chargement de la page
  useEffect(() => {
    axios.get("/api/panneaux")
      .then((response) => {
        setPanneaux(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des panneaux :", error);
      });
  }, []);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "80vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Affichage des panneaux dynamiques */}
      {panneaux.map((panneau) => (
        <Marker 
          key={panneau.id} 
          position={[panneau.latitude, panneau.longitude] as LatLngExpression} 
          icon={customIcon}
        >
          <Popup>
            <strong>{panneau.adresse}</strong><br />
            Type : {panneau.type}<br />
            Dimensions : {panneau.dimensions}<br />
            Prix : {panneau.prix} FCFA<br />
            Régie : {panneau.regie}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
