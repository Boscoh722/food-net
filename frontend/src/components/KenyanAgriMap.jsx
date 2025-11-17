import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LeafletTrackingMarker } from 'react-leaflet-tracking-marker';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  html: `
    <div class="custom-marker">
      <div class="marker-pulse"></div>
      <div class="marker-inner">
        <div class="marker-icon">🌱</div>
      </div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: 'custom-marker-container'
});

L.Marker.prototype.options.icon = DefaultIcon;

const agriculturalZones = [
  {
    name: 'Nairobi',
    position: [-1.2921, 36.8219],
    description: 'Central Distribution Hub',
    radius: 50000,
    color: 'var(--color-primary-500)',
    gradient: 'from-primary-500 to-primary-600',
    icon: '🏢'
  },
  {
    name: 'Eldoret',
    position: [0.5143, 35.2698],
    description: 'Grain Farming Region',
    radius: 70000,
    color: 'var(--color-accent-500)',
    gradient: 'from-accent-500 to-accent-600',
    icon: '🌾'
  },
  {
    name: 'Nakuru',
    position: [-0.3031, 36.0800],
    description: 'Mixed Farming Zone',
    radius: 45000,
    color: 'var(--color-success-500)',
    gradient: 'from-success-500 to-success-600',
    icon: '🐄'
  },
  {
    name: 'Kisumu',
    position: [-0.0917, 34.7680],
    description: 'Lake Region Agriculture',
    radius: 40000,
    color: 'var(--color-blue-500)',
    gradient: 'from-blue-500 to-blue-600',
    icon: '🎣'
  },
  {
    name: 'Mombasa',
    position: [-4.0435, 39.6682],
    description: 'Coastal Agriculture',
    radius: 60000,
    color: 'var(--color-warning-500)',
    gradient: 'from-warning-500 to-warning-600',
    icon: '🏖️'
  },
  {
    name: 'Machakos',
    position: [-1.5222, 37.2614],
    description: 'Eastern Region Farming',
    radius: 45000,
    color: 'var(--color-error-500)',
    gradient: 'from-error-500 to-error-600',
    icon: '🌵'
  }
];

export default function KenyanAgriMap() {
  const [previousPos, setPreviousPos] = useState(null);

  useEffect(() => {
    // Custom CSS for markers
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
        background: currentColor;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse 2s infinite;
      }
      .marker-inner {
        position: relative;
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, var(--tw-color-primary-600) 0%, var(--tw-color-primary-700) 100%);
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
        backdrop-filter: blur(10px) !important;
        background: rgba(255, 255, 255, 0.95) !important;
      }
      .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
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

  const createCustomIcon = (zone) => {
    return L.divIcon({
      html: `
        <div class="custom-marker" style="color: ${zone.color}">
          <div class="marker-pulse"></div>
          <div class="marker-inner" style="background: linear-gradient(135deg, ${zone.color} 0%, ${zone.color}99 100%)">
            <div class="marker-icon">${zone.icon}</div>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      className: 'custom-marker-container'
    });
  };

  return (
    <MapContainer
      center={[-1.2921, 36.8219]} 
      zoom={7}
      className="h-full w-full rounded-2xl shadow-soft border border-gray-200/60 overflow-hidden"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {agriculturalZones.map((zone) => (
        <div key={zone.name}>
          <Marker 
            position={zone.position}
            icon={createCustomIcon(zone)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${zone.color} 0%, ${zone.color}99 100%)` }}
                  >
                    {zone.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg font-['Plus_Jakarta_Sans']">
                      {zone.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {zone.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="badge badge-primary font-semibold">
                    Agricultural Zone
                  </span>
                  <span className="text-gray-500 font-medium">
                    Radius: {(zone.radius / 1000).toFixed(0)}km
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={zone.position}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.8,
              className: 'agricultural-zone-circle'
            }}
          >
            <Popup>
              <div className="p-3">
                <h4 className="font-bold text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">
                  {zone.name} Agricultural Zone
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Major farming region specializing in local produce
                </p>
                <div className="badge badge-success text-xs">
                  Active Farming Community
                </div>
              </div>
            </Popup>
          </Circle>
        </div>
      ))}
    </MapContainer>
  );
}