import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = () => {
  const position = [11.5564, 104.9282]; // Phnom Penh

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Driver Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;