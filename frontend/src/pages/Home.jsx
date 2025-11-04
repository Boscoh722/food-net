import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categories = [
  'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meats', 'Fish', 'Spices', 'Tubers'
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Map */}
        <div className="h-96 md:h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search location or item..."
                className="flex-grow px-3 py-1 border rounded"
              />
            </div>
            <MapContainer
              center={[-1.2921, 36.8219]} // Nairobi
              zoom={6}
              style={{ height: 'calc(100% - 60px)', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Marker position={[-1.2921, 36.8219]}>
                <Popup>Maize - KSh 500/kg<br />Nairobi</Popup>
              </Marker>
              <Marker position={[-0.0917, 34.7680]}>
                <Popup>Sukuma Wiki - KSh 50/bunch<br />Kisumu</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Right: Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary">Food Categories in Kenya</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat}
                className="card text-center cursor-pointer hover:shadow-xl transition"
              >
                <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
