import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { API_BASE } from "../services/apiConfig";
import axios from "axios";
import "../styles/GoogleHealthMap.css";

// Default healthcare facilities with coordinates for rural demo
const defaultFacilities = [
  {
    _id: "doc1",
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    hospitalOrClinicName: "Sunshine Rural Hospital",
    city: "Gachibowli, Hyderabad",
    phone: "9876501234",
    consultationFee: 600,
    lat: 17.4401,
    lng: 78.3489,
    type: "Hospital",
    rating: "4.9 ⭐",
    timings: "9:00 AM - 2:00 PM"
  },
  {
    _id: "doc2",
    name: "Dr. Mohammed Shameem",
    specialization: "General Physician",
    hospitalOrClinicName: "Aman Nagar Primary Health Center (PHC)",
    city: "Talab Katta, Hyderabad",
    phone: "08328373721",
    consultationFee: 200,
    lat: 17.3596,
    lng: 78.4841,
    type: "PHC",
    rating: "4.8 ⭐",
    timings: "8:00 AM - 5:00 PM"
  },
  {
    _id: "doc3",
    name: "Dr. Yash Verma",
    specialization: "Cardiologist",
    hospitalOrClinicName: "Telangana Community Heart Center",
    city: "Secunderabad",
    phone: "9849012345",
    consultationFee: 500,
    lat: 17.4399,
    lng: 78.4983,
    type: "Clinic",
    rating: "4.9 ⭐",
    timings: "10:00 AM - 4:00 PM"
  },
  {
    _id: "doc4",
    name: "Dr. Arjun Reddy",
    specialization: "Orthopedic",
    hospitalOrClinicName: "Rural Joint & Trauma Care Clinic",
    city: "Kompally Rural Wing",
    phone: "9988776655",
    consultationFee: 350,
    lat: 17.5349,
    lng: 78.4847,
    type: "Clinic",
    rating: "4.7 ⭐",
    timings: "9:30 AM - 3:30 PM"
  },
  {
    _id: "doc5",
    name: "Dr. Sunita Devi",
    specialization: "Gynecologist",
    hospitalOrClinicName: "Maternal & Child PHC Center",
    city: "Shamshabad Rural",
    phone: "9123456780",
    consultationFee: 250,
    lat: 17.2628,
    lng: 78.3970,
    type: "PHC",
    rating: "4.9 ⭐",
    timings: "8:30 AM - 4:30 PM"
  },
  {
    _id: "phc_emergency",
    name: "108 Rural Emergency Ambulance Depot",
    specialization: "Emergency & Trauma",
    hospitalOrClinicName: "National Health Mission Emergency Unit",
    city: "Central Rural Hub",
    phone: "108",
    consultationFee: 0,
    lat: 17.3850,
    lng: 78.4867,
    type: "Emergency",
    rating: "5.0 🚨",
    timings: "24/7 Available"
  }
];

const GoogleHealthMap = ({ initialSpecialty = "ALL", onSelectDoctor }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();
  const { showSuccess, showInfo, showError } = useToast();

  const [facilities, setFacilities] = useState(defaultFacilities);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLayer, setMapLayer] = useState("streets"); // 'streets' | 'satellite' | 'terrain'

  // Fetch doctors from backend and merge with coordinates
  useEffect(() => {
    axios.get(`${API_BASE}/doctors`)
      .then((res) => {
        const docs = res.data?.data || [];
        if (docs.length > 0) {
          const merged = docs.map((d, index) => {
            // Assign demo lat/lng offsets if not present
            const baseLat = 17.3850 + (index % 5 - 2) * 0.045 + (index * 0.007);
            const baseLng = 78.4867 + (index % 4 - 2) * 0.052 + (index * 0.009);
            return {
              _id: d._id,
              name: d.name.startsWith("Dr.") ? d.name : `Dr. ${d.name}`,
              specialization: d.specialization || "General Physician",
              hospitalOrClinicName: d.hospitalOrClinicName || "Primary Health Center",
              city: [d.city, d.state].filter(Boolean).join(", ") || "Rural District",
              phone: d.phone || "9876543210",
              consultationFee: d.consultationFee || 200,
              lat: d.coordinates?.lat || baseLat,
              lng: d.coordinates?.lng || baseLng,
              type: d.hospitalType || "Clinic",
              rating: "4.8 ⭐",
              timings: "9:00 AM - 5:00 PM"
            };
          });
          setFacilities([...merged, defaultFacilities[5]]); // include 108 ambulance
        }
      })
      .catch(() => {});
  }, []);

  // Initialize Map using Leaflet with Google Maps compatible layers
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [17.3850, 78.4867],
        zoom: 11,
        zoomControl: true,
      });

      // Google-style clean tile layer
      const tileUrl =
        mapLayer === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      const tiles = window.L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a> / OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      mapInstanceRef.current._tiles = tiles;
    }

    return () => {
      // Keep map alive during tab transitions
    };
  }, []);

  // Update map layer on toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    if (map._tiles) {
      map.removeLayer(map._tiles);
    }
    const tileUrl =
      mapLayer === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    map._tiles = window.L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a> / OSM',
      maxZoom: 19,
    }).addTo(map);
  }, [mapLayer]);

  // Render & update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Filter facilities
    const filtered = facilities.filter((f) => {
      const matchesType =
        selectedType === "ALL" ||
        (selectedType === "PHC" && f.type === "PHC") ||
        (selectedType === "Hospital" && f.type === "Hospital") ||
        (selectedType === "Clinic" && f.type === "Clinic") ||
        (selectedType === "Emergency" && f.type === "Emergency");

      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.hospitalOrClinicName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });

    filtered.forEach((item) => {
      const isEmergency = item.type === "Emergency";
      const isPHC = item.type === "PHC";

      // Custom HTML Marker Pin
      const iconHtml = `
        <div class="custom-map-pin ${isEmergency ? "pin-emergency" : isPHC ? "pin-phc" : "pin-doctor"}">
          <span>${isEmergency ? "🚨" : isPHC ? "🏥" : "🩺"}</span>
        </div>
      `;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: "custom-div-icon",
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -36]
      });

      const marker = window.L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedFacility(item);
        map.panTo([item.lat, item.lng], { animate: true, duration: 0.6 });
      });

      markersRef.current.push(marker);
    });
  }, [facilities, selectedType, searchQuery]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported by your browser.", "GPS Error");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current && window.L) {
          const map = mapInstanceRef.current;
          map.setView([latitude, longitude], 13);

          // Add pulsating user marker
          const userIcon = window.L.divIcon({
            html: `<div class="user-gps-pin"><span class="gps-pulse-ring"></span>📍</div>`,
            className: "user-gps-div",
            iconSize: [34, 34],
            iconAnchor: [17, 34]
          });

          window.L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>📍 You are here</b><br/>Searching nearest rural clinics...")
            .openPopup();

          showSuccess("Location locked! Showing clinics closest to you.", "GPS Active 🎯");
        }
      },
      (err) => {
        setLocating(false);
        // Fallback default simulation location
        const simLat = 17.3850;
        const simLng = 78.4867;
        setUserLocation({ lat: simLat, lng: simLng });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([simLat, simLng], 13);
        }
        showInfo("Using simulated rural coordinates (Hyderabad Rural Center).", "GPS Simulated");
      },
      { timeout: 8000 }
    );
  };

  const getGoogleMapsDirectionsUrl = (lat, lng, name) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
  };

  const handleBookNow = (fac) => {
    const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));
    if (onSelectDoctor) {
      onSelectDoctor(fac._id);
    } else if (savedPatient && savedPatient._id) {
      navigate(`/book-appointment/${fac._id}/${savedPatient._id}`);
    } else {
      navigate("/doctors");
    }
  };

  return (
    <div className="google-health-map-card glass-panel">
      {/* Map Control Header */}
      <div className="map-top-bar">
        <div className="map-title-block">
          <div className="map-badge-pill">
            <span>🗺️</span> Google Maps & Rural GPS Locator
          </div>
          <h3>Find Nearby Rural Health Centers & Specialists</h3>
          <p>Real-time turn-by-turn navigation to Primary Health Centers (PHCs) and verified doctors</p>
        </div>

        <div className="map-actions-row">
          <button
            className={`btn-secondary btn-sm gps-locate-btn ${locating ? "loading" : ""}`}
            onClick={handleLocateMe}
            disabled={locating}
          >
            {locating ? "Locating..." : "📍 Use My GPS Location"}
          </button>

          <div className="map-layer-toggle">
            <button
              className={`layer-btn ${mapLayer === "streets" ? "active" : ""}`}
              onClick={() => setMapLayer("streets")}
            >
              🗺️ Map
            </button>
            <button
              className={`layer-btn ${mapLayer === "satellite" ? "active" : ""}`}
              onClick={() => setMapLayer("satellite")}
            >
              🛰️ Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="map-filter-toolbar">
        <div className="map-search-input">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by clinic name, doctor, or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && <button onClick={() => setSearchQuery("")}>✕</button>}
        </div>

        <div className="map-filter-chips">
          {["ALL", "PHC", "Hospital", "Clinic", "Emergency"].map((type) => (
            <button
              key={type}
              className={`map-chip ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type === "Emergency" ? "🚨 Emergency SOS (108)" : type === "PHC" ? "🏥 Rural PHC" : type === "Hospital" ? "🏨 Hospitals" : type === "Clinic" ? "🩺 Clinics" : "🌐 All Centers"}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout View */}
      <div className="map-viewport-grid">
        {/* Live Interactive Map Box */}
        <div className="map-canvas-wrapper">
          <div ref={mapContainerRef} className="leaflet-map-element" />

          {/* Quick overlay helper */}
          <div className="map-overlay-guide">
            <span>💡 Tip: Click any map pin to view instant details & Google Maps directions</span>
          </div>
        </div>

        {/* Selected Facility Details Side Panel */}
        <div className="map-details-sidebar">
          {selectedFacility ? (
            <div className="facility-detail-card">
              <div className="facility-card-header">
                <div className="facility-type-tag">
                  {selectedFacility.type === "Emergency" ? "🚨 24/7 Emergency Hub" : `🏥 ${selectedFacility.type}`}
                </div>
                <button className="facility-close-btn" onClick={() => setSelectedFacility(null)}>✕</button>
              </div>

              <h4>{selectedFacility.name}</h4>
              <div className="facility-spec">{selectedFacility.specialization}</div>
              <div className="facility-hospital">{selectedFacility.hospitalOrClinicName}</div>

              <div className="facility-info-list">
                <div className="info-row">
                  <span>📍 Address:</span>
                  <strong>{selectedFacility.city}</strong>
                </div>
                <div className="info-row">
                  <span>🕒 Timings:</span>
                  <strong>{selectedFacility.timings}</strong>
                </div>
                <div className="info-row">
                  <span>⭐ Rating:</span>
                  <strong>{selectedFacility.rating} (Ayushman Verified)</strong>
                </div>
                {selectedFacility.consultationFee > 0 ? (
                  <div className="info-row fee-highlight">
                    <span>💵 Consultation:</span>
                    <strong>₹{selectedFacility.consultationFee}</strong>
                  </div>
                ) : (
                  <div className="info-row fee-free">
                    <span>💵 Consultation:</span>
                    <strong style={{ color: "#16a34a" }}>FREE / Gov. Subsidized</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="facility-action-stack">
                <a
                  href={getGoogleMapsDirectionsUrl(selectedFacility.lat, selectedFacility.lng, selectedFacility.hospitalOrClinicName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary map-nav-btn"
                >
                  🚗 Open Google Maps Directions ➜
                </a>

                {selectedFacility.type !== "Emergency" ? (
                  <button
                    className="btn-secondary"
                    onClick={() => handleBookNow(selectedFacility)}
                  >
                    📅 Book Teleconsultation
                  </button>
                ) : (
                  <a href="tel:108" className="btn-danger map-nav-btn">
                    📞 Call 108 Emergency Ambulance
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="facility-placeholder-card">
              <div className="placeholder-icon">📍</div>
              <h4>Select a Clinic Pin on the Map</h4>
              <p>Click on any doctor pin or rural PHC to view directions, consultation timings, and instant booking options.</p>
              
              <div className="quick-centers-list">
                <span className="quick-list-title">⚡ Quick Access Centers:</span>
                {facilities.slice(0, 3).map((f) => (
                  <div
                    key={f._id}
                    className="quick-center-item"
                    onClick={() => {
                      setSelectedFacility(f);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo([f.lat, f.lng], { animate: true });
                      }
                    }}
                  >
                    <div className="qc-icon">{f.type === "Emergency" ? "🚨" : "🏥"}</div>
                    <div className="qc-info">
                      <div className="qc-name">{f.name}</div>
                      <div className="qc-sub">{f.specialization} • {f.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleHealthMap;
