import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Required for routing-machine
window.L = L;
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🏫 Departments
const buildings = [
  { name: "Asha M. Tarsadia Institute of Computer Science and Technology", lat: 21.067853916395077, lng: 73.1313612357706 },
  { name: "Babu Madhav Institute of Information Technology", lat: 21.067848726027282, lng: 73.1306848801871 },
  { name: "Department of Electrical Engineering", lat: 21.067809489600112, lng: 73.13116141119326 },
  { name: "Department of Chemical Engineering", lat: 21.067129513029855, lng: 73.13054446128162 },
  { name: "UTU Central Library", lat: 21.06691332230032, lng: 73.13018202778811 },
  { name: "Department of Mathematics", lat: 21.06649501893903, lng: 73.12918689718535 },
  { name: "Agriculture UTU", lat: 21.067098226400436, lng: 73.12738074668536 },
  { name: "Tarsadia Institute of Chemical Science", lat: 21.066432110966016, lng: 73.12919750250177 },
  { name: "Shrimad Rajchandra College of Physiotherapy", lat: 21.06806722486163, lng: 73.12972191154772 },
  { name: "Maliba Education Academy", lat: 21.068345720572673, lng: 73.12958187157125 },
  { name: "Shrimad Rajchandra School of Sports", lat: 21.068263335963877, lng: 73.1278023383454 },
  {name: "UTU Cricket Ground", lat:21.068713859231185, lng: 73.12837901330832 },
  {name: "Godavariba School of Interior Design", lat: 21.068904079757296, lng: 73.12947067237769 },
  {name: "Helipad UTU", lat:21.068991055509652, lng: 73.1250962300956},
  {name: "UTU Office", lat: 21.068910962725038, lng: 73.133040933245},
  {name: "Chhotubhai Gopalbhai Patel Institute of Technology ", lat:21.067510490425224, lng: 73.13057459813425},
  {name: "C. G. Bhakta Institute of Biotechnology", lat:21.06917126409697, lng: 73.13290682282368 },
  {name: "Department of Computer Science and Technology", lat:21.06946910836526, lng: 73.13347813328478},
  {name: "SRIMCA MBA", lat:21.069095256877752, lng: 73.13397326549592 },
  {name: "Maliba bus stand", lat:21.06844883781615, lng: 73.13475833703387},
  {name: "Matiya Patidar Ayurvedic hospital", lat:21.06987780128723, lng: 73.13525350368987},
  {name: " Second Campus Gate", lat:21.067908386627245, lng: 73.1316407527303},
  {name: "First Campus Gate", lat:21.068399674455303, lng: 73.13457505570635},
  {name: "Bus Parking ", lat:21.070071723942746, lng: 73.13203909691781},
  {name: "Eacho Parking", lat:21.0686219202603, lng: 73.13207584860378}
];


export default function CampusMap() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const mapRef = useRef(null);
  const [routeControl, setRouteControl] = useState(null);
  const [fallbackLine, setFallbackLine] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  const findBuilding = (text) =>
    buildings.find((b) =>
      b.name.toLowerCase().includes(text.toLowerCase())
    );

  // Haversine distance (fallback)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🚶 Find route
  const handleSearch = () => {
    const map = mapRef.current;
    if (!map) return;

    const from = findBuilding(fromText);
    const to = findBuilding(toText);

    if (!from || !to) {
      alert("Please enter valid department names.");
      return;
    }

    // Clear previous routes
    if (routeControl) map.removeControl(routeControl);
    if (fallbackLine) map.removeLayer(fallbackLine);

    const drawFallback = () => {
      const line = L.polyline(
        [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
        { dashArray: "6,6", weight: 4 }
      ).addTo(map);

      map.fitBounds(line.getBounds());

      const km = calculateDistance(
        from.lat,
        from.lng,
        to.lat,
        to.lng
      ).toFixed(2);

      const minutes = Math.round((km / 5) * 60);

      setFallbackLine(line);
      setDistance(km);
      setTime(minutes);
    };

    const control = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
        useHints: false,
      }),
      addWaypoints: false,
      show: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    // ✅ Road route found
    control.on("routesfound", (e) => {
      const meters = e.routes[0].summary.totalDistance;

      // Detect invalid route
      if (!meters || meters < 20) {
        map.removeControl(control);
        drawFallback();
        return;
      }

      const km = (meters / 1000).toFixed(2);
      const minutes = Math.round((km / 5) * 60);

      setDistance(km);
      setTime(minutes);
    });

    // ❌ If routing fails → fallback
    control.on("routingerror", () => {
      map.removeControl(control);
      drawFallback();
    });

    setRouteControl(control);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ padding: 15, width: "350px" }}>
        <input
          style={inputStyle}
          placeholder="From department..."
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="To department..."
          value={toText}
          onChange={(e) => setToText(e.target.value)}
        />

        <button
          onClick={handleSearch}
          style={{
            height: "42px",
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🚶 Find Route
        </button>

        {distance && time && (
          <div style={{ marginTop: 8 }}>
            <strong>Distance:</strong> {distance} km <br />
            <strong>Estimated Time:</strong> {time} min 🚶
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[21.0679, 73.1308]}
        zoom={18}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri"
          maxZoom={20}
        />

        {buildings.map((b, i) => (
          <Marker key={i} position={[b.lat, b.lng]}>
            <Popup>{b.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: "44px",
  fontSize: "16px",
  padding: "8px 12px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
