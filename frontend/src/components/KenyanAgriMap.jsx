import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    },
  });
  return null;
}

// Custom icon for selected location
const createSelectedLocationIcon = (color = '#ef4444') => {
  return L.divIcon({
    html: `
      <div class="custom-marker" style="color: ${color}">
        <div class="marker-pulse" style="background-color: ${color}"></div>
        <div class="marker-inner" style="background: linear-gradient(135deg, ${color} 0%, ${color}99 100%)">
          <div class="marker-icon">📍</div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    className: 'custom-marker-container'
  });
};

export default function LocationPickerMap({ onLocationSelect, initialLocation = [-1.2921, 36.8219] }) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleLocationSelect = (coordinates) => {
    setSelectedLocation(coordinates);
    if (onLocationSelect) {
      onLocationSelect(coordinates);
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker-container {
        background: transparent !important;
        border: none !important;
      }
      .custom-marker {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .marker-pulse {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse 2s infinite;
      }
      .marker-inner {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .marker-icon {
        transform: rotate(45deg);
        font-size: 14px;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 1rem !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        background: rgba(255, 255, 255, 0.95) !important;
      }
      .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      .leaflet-container {
        cursor: crosshair !important;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.6;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.3;
        }
        100% {
          transform: scale(0.8);
          opacity: 0.6;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">📍 Select Location</h3>
        <p className="text-sm text-gray-600">
          Click anywhere on the map to select a location
        </p>
        {selectedLocation && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              Selected: {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <MapContainer
        center={initialLocation}
        zoom={7}
        className="h-full w-full rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden"
        style={{ minHeight: '500px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        
        {selectedLocation && (
          <Marker 
            position={selectedLocation}
            icon={createSelectedLocationIcon()}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm bg-gradient-to-br from-red-500 to-red-400">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Selected Location
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    Custom Location
                  </span>
                  <span className="text-gray-500 font-medium">
                    Click to change
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}