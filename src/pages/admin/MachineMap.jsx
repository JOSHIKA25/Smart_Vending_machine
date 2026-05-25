import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MachineMap() {

  const position = [6.9271, 79.8612]; // replace with machine latitude & longitude

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          VM-102 <br /> Library Block
        </Popup>
      </Marker>

    </MapContainer>
  );
}