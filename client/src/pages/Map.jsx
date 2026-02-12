import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css";

// Required for routing-machine
window.L = L;
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🏫 Buildings + Food Shops
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
  { name: "UTU Cricket Ground", lat:21.068713859231185, lng: 73.12837901330832 },
  { name: "Godavariba School of Interior Design", lat: 21.068904079757296, lng: 73.12947067237769 },
  { name: "Helipad UTU", lat:21.068991055509652, lng: 73.1250962300956},
  { name: "UTU Office", lat: 21.068910962725038, lng: 73.133040933245},
  { name: "Chhotubhai Gopalbhai Patel Institute of Technology", lat:21.067510490425224, lng: 73.13057459813425},
  { name: "C. G. Bhakta Institute of Biotechnology", lat:21.06917126409697, lng: 73.13290682282368 },
  { name: "Department of Computer Science and Technology", lat:21.06946910836526, lng: 73.13347813328478},
  { name: "SRIMCA MBA", lat:21.069095256877752, lng: 73.13397326549592 },
  { name: "Maliba bus stand", lat:21.06844883781615, lng: 73.13475833703387},
  { name: "Matiya Patidar Ayurvedic hospital", lat:21.06987780128723, lng: 73.13525350368987},
  { name: "Second Campus Gate", lat:21.067908386627245, lng: 73.1316407527303},
  { name: "First Campus Gate", lat:21.068399674455303, lng: 73.13457505570635},
  { name: "Bus Parking", lat:21.070071723942746, lng: 73.13203909691781},
  { name: "Eacho Parking", lat:21.0686219202603, lng: 73.13207584860378},
  { name: "Foodies", lat:21.066638573591465, lng: 73.13027477943602},
  { name: "Shri Rang Bhajan", lat:21.066388546385735, lng: 73.13040236751597},
  { name: "Mahalaxmi Fast Food", lat:21.06630520389074, lng: 73.13042469542985},
   { name:"Chirag Tea Center", lat:21.06812533386228, lng:73.13045978215283},

];

// Straight-line distance in meters (Haversine)
function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Campus path graph: connect nearby buildings (walking path waypoints), then shortest path
const MAX_EDGE_M = 520;
const PATH_FACTOR = 1.2;
const WALK_SPEED_KMH = 4.8; // ~80 m/min, more accurate for campus walking

// Memoized graph for performance (build once per session)
let cachedAdj = null;
function getCampusGraph() {
  if (cachedAdj) return cachedAdj;
  const n = buildings.length;
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversineDistanceMeters(
        buildings[i].lat, buildings[i].lng,
        buildings[j].lat, buildings[j].lng
      );
      if (d <= MAX_EDGE_M) {
        const w = d * PATH_FACTOR;
        adj[i].push({ to: j, w });
        adj[j].push({ to: i, w });
      }
    }
  }
  cachedAdj = adj;
  return adj;
}

function dijkstraPath(adj, fromIdx, toIdx) {
  const n = adj.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const heap = [{ idx: fromIdx, d: 0 }];
  dist[fromIdx] = 0;
  while (heap.length) {
    heap.sort((a, b) => a.d - b.d);
    const { idx: u, d: du } = heap.shift();
    if (u === toIdx) break;
    if (du > dist[u]) continue;
    for (const { to: v, w } of adj[u]) {
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        heap.push({ idx: v, d: alt });
      }
    }
  }
  const path = [];
  let cur = toIdx;
  while (cur !== -1) {
    path.push(cur);
    cur = prev[cur];
  }
  path.reverse();
  return { path, totalMeters: dist[toIdx] };
}

// Get path as array of waypoints and total meters (path distance along campus)
function getCampusPath(from, to) {
  const fromIdx = buildings.findIndex((b) => b.name === from.name);
  const toIdx = buildings.findIndex((b) => b.name === to.name);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return null;
  const adj = getCampusGraph();
  const { path, totalMeters } = dijkstraPath(adj, fromIdx, toIdx);
  if (totalMeters === Infinity || path.length < 2) return null;
  const waypoints = path.map((i) => [buildings[i].lat, buildings[i].lng]);
  return { waypoints, totalMeters };
}

// 🎯 Auto zoom helper
function AutoZoomToShop({ shop }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!shop) return;

    map.flyTo([shop.lat, shop.lng], 20, {
      animate: true,
      duration: 1.5,
    });

    setTimeout(() => {
      markerRef.current?.openPopup();
    }, 1200);
  }, [shop, map]);

  if (!shop) return null;

  return (
    <Marker position={[shop.lat, shop.lng]} ref={markerRef}>
      <Popup>📍 <strong>{shop.name}</strong></Popup>
    </Marker>
  );
}

export default function CampusMap() {
  const location = useLocation();
  const selectedShop = location.state;

  const mapRef = useRef(null);
  const pathLayerRef = useRef(null);
  const routeControlRef = useRef(null); // so we can remove correct control when clearing
  const [routeControl, setRouteControl] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [distanceType, setDistanceType] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // 🔍 Suggestion logic
  const getSuggestions = (text) => {
    if (!text) return [];
    return buildings.filter((b) =>
      b.name.toLowerCase().includes(text.toLowerCase())
    );
  };

  const findBuilding = (text) =>
    buildings.find(
      (b) => b.name.toLowerCase() === text.toLowerCase()
    );

  // Clear any existing route from map
  const clearRoute = (map) => {
    if (!map) return;
    if (routeControlRef.current) {
      try { map.removeControl(routeControlRef.current); } catch (_) {}
      routeControlRef.current = null;
      setRouteControl(null);
    }
    if (pathLayerRef.current) {
      map.removeLayer(pathLayerRef.current);
      pathLayerRef.current = null;
    }
  };

  // 🚶 Find Route — prefer OSRM walking route; fallback to campus path (building-to-building)
  const handleSearch = () => {
    const map = mapRef.current;
    const from = findBuilding(fromText);
    const to = findBuilding(toText);

    if (!map || !from || !to) {
      alert("Please select valid From and To locations.");
      return;
    }

    const straightMeters = haversineDistanceMeters(from.lat, from.lng, to.lat, to.lng);
    if (straightMeters < 5) {
      clearRoute(map);
      setDistance("0");
      setTime(0);
      setDistanceType("same");
      setIsSearching(false);
      return;
    }

    clearRoute(map);
    setDistance(null);
    setTime(null);
    setDistanceType(null);
    setIsSearching(true);

    const control = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
      }),
      addWaypoints: false,
      show: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    control.on("routesfound", (e) => {
      setIsSearching(false);
      const route = e.routes?.[0];
      const meters = route?.summary?.totalDistance;
      if (meters != null && meters > 10) {
        const km = (meters / 1000).toFixed(2);
        const totalTimeSec = route?.summary?.totalTime;
        const minutes = totalTimeSec != null
          ? Math.max(1, Math.round(totalTimeSec / 60))
          : Math.max(1, Math.round((meters / 1000 / (WALK_SPEED_KMH / 60)))); // m -> min at 4.8 km/h
        setDistance(km);
        setTime(minutes);
        setDistanceType("walking");
      } else {
        useCampusPathFallback();
      }
    });

    const useCampusPathFallback = () => {
      setIsSearching(false);
      try { map.removeControl(control); } catch (_) {}
      routeControlRef.current = null;
      setRouteControl(null);
      const campus = getCampusPath(from, to);
      if (campus) {
        const km = (campus.totalMeters / 1000).toFixed(2);
        const minutes = Math.max(1, Math.round((campus.totalMeters / 1000) / (WALK_SPEED_KMH / 60)));
        setDistance(km);
        setTime(minutes);
        setDistanceType("campus");
        const latLngs = campus.waypoints.map(([lat, lng]) => L.latLng(lat, lng));
        const polyline = L.polyline(latLngs, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.8,
          dashArray: "10, 10",
        }).addTo(map);
        pathLayerRef.current = polyline;
        map.fitBounds(polyline.getBounds(), { padding: [30, 30], maxZoom: 18 });
      } else {
        const m = haversineDistanceMeters(from.lat, from.lng, to.lat, to.lng) * PATH_FACTOR;
        const km = (m / 1000).toFixed(2);
        setDistance(km);
        setTime(Math.max(1, Math.round((m / 1000) / (WALK_SPEED_KMH / 60))));
        setDistanceType("straight");
        const polyline = L.polyline(
          [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
          { color: "#94a3b8", weight: 4, opacity: 0.7, dashArray: "8, 8" }
        ).addTo(map);
        pathLayerRef.current = polyline;
      }
    };

    control.on("routingerror", () => {
      setIsSearching(false);
      useCampusPathFallback();
    });

    routeControlRef.current = control;
    setRouteControl(control);
  };

  const handleClearRoute = () => {
    const map = mapRef.current;
    if (map) clearRoute(map);
    setIsSearching(false);
    setDistance(null);
    setTime(null);
    setDistanceType(null);
  };

  const hasRoute = distance != null;

  return (
    <div className="map-page">
      <div className="map-wrapper">
        <MapContainer
          ref={mapRef}
          center={[21.0679, 73.1308]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
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
          <AutoZoomToShop shop={selectedShop} />
        </MapContainer>
      </div>

      <div className="map-panel">
        <div className="map-panel-header">
          <h1>Campus Map</h1>
          <p>Get directions between buildings &amp; spots</p>
        </div>
        <div className="map-panel-body">
          <div className="map-field">
            <label className="map-field-label">From</label>
            <div className="map-input-wrap">
              <input
                type="text"
                className="map-input"
                placeholder="Search starting point..."
                value={fromText}
                onChange={(e) => {
                  const v = e.target.value;
                  setFromText(v);
                  setFromSuggestions(getSuggestions(v));
                }}
              />
              <span className="map-input-icon" aria-hidden>📍</span>
            </div>
            {fromSuggestions.length > 0 && (
              <div className="map-suggestions">
                {fromSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="map-suggestion-item"
                    onClick={() => {
                      setFromText(item.name);
                      setFromSuggestions([]);
                    }}
                  >
                    <span className="pin">📍</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="map-field">
            <label className="map-field-label">To</label>
            <div className="map-input-wrap">
              <input
                type="text"
                className="map-input"
                placeholder="Search destination..."
                value={toText}
                onChange={(e) => {
                  const v = e.target.value;
                  setToText(v);
                  setToSuggestions(getSuggestions(v));
                }}
              />
              <span className="map-input-icon" aria-hidden>🎯</span>
            </div>
            {toSuggestions.length > 0 && (
              <div className="map-suggestions">
                {toSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="map-suggestion-item"
                    onClick={() => {
                      setToText(item.name);
                      setToSuggestions([]);
                    }}
                  >
                    <span className="pin">📍</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="map-actions">
            <button
              type="button"
              className="map-btn map-btn-primary"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <span className="map-loading-dot" />
                  <span className="map-loading-dot" />
                  <span className="map-loading-dot" />
                  <span className="map-loading-text">Finding…</span>
                </>
              ) : (
                <>Find route</>
              )}
            </button>
            <button
              type="button"
              className="map-btn map-btn-secondary"
              onClick={handleClearRoute}
              disabled={!hasRoute && !isSearching}
            >
              Clear
            </button>
          </div>

          {isSearching && (
            <div className="map-loading">
              <span className="map-loading-dot" />
              <span className="map-loading-dot" />
              <span className="map-loading-dot" />
              <span>Finding best route...</span>
            </div>
          )}

          {hasRoute && !isSearching && (
            <div className={`map-route-card ${distanceType === "same" ? "same-location" : ""}`}>
              <div className="map-route-row">
                <span className="map-route-label">Distance</span>
                <span className="map-route-value">
                  {distanceType === "same"
                    ? "0 km"
                    : parseFloat(distance) < 0.1
                      ? `${Math.round(parseFloat(distance) * 1000)} m`
                      : `${distance} km`}
                  {distanceType === "walking" && <span className="map-route-badge">Street route</span>}
                  {distanceType === "campus" && <span className="map-route-badge">Campus path</span>}
                  {distanceType === "straight" && <span className="map-route-badge">Direct</span>}
                  {distanceType === "same" && <span className="map-route-badge">Same location</span>}
                </span>
              </div>
              {distanceType !== "same" && (
                <div className="map-route-row">
                  <span className="map-route-label">Est. walking time</span>
                  <span className="map-route-value">~{time} min</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

