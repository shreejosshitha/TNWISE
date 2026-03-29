import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { AdminComplaint } from "../../../backend/adminApi";

interface MapViewProps {
  complaints: AdminComplaint[];
}

const markerColor = (priority: string, status: string) => {
  if (status === "RESOLVED") return "#34d399";
  if (priority === "HIGH") return "#f43f5e";
  if (priority === "MEDIUM") return "#f59e0b";
  return "#22c55e";
};

const heatColor = (count: number) => {
  if (count >= 6) return "rgba(244, 63, 94, 0.35)";
  if (count >= 3) return "rgba(245, 158, 11, 0.25)";
  return "rgba(34, 197, 94, 0.18)";
};

export function MapView({ complaints }: MapViewProps) {
  const center = complaints.length ? [complaints[0].coordinates.lat, complaints[0].coordinates.lng] : [13.0358, 80.2440];

  const heatClusters = complaints.reduce<Record<string, { lat: number; lng: number; count: number }>>((acc, complaint) => {
    const latKey = Math.round(complaint.coordinates.lat * 100) / 100;
    const lngKey = Math.round(complaint.coordinates.lng * 100) / 100;
    const key = `${latKey}_${lngKey}`;
    if (!acc[key]) {
      acc[key] = { lat: complaint.coordinates.lat, lng: complaint.coordinates.lng, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Complaint Heatmap</h3>
          <p className="text-sm text-slate-500">Interactive map showing complaint locations with density highlights.</p>
        </div>
      </div>
      <div className="mt-6 h-[420px] w-full overflow-hidden rounded-3xl">
        <MapContainer center={center as [number, number]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.values(heatClusters).map((cluster, index) => (
            <CircleMarker
              key={`heat-${index}`}
              center={[cluster.lat, cluster.lng]}
              radius={20 + cluster.count * 5}
              pathOptions={{
                color: heatColor(cluster.count),
                fillColor: heatColor(cluster.count),
                fillOpacity: 0.35,
                stroke: false,
              }}
            />
          ))}
          {complaints.map((complaint) => (
            <CircleMarker
              key={complaint._id}
              center={[complaint.coordinates.lat, complaint.coordinates.lng]}
              radius={8}
              pathOptions={{ color: markerColor(complaint.priority, complaint.status), fillColor: markerColor(complaint.priority, complaint.status), fillOpacity: 0.8 }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">{complaint.complaintId}</p>
                  <p>{complaint.type}</p>
                  <p>{complaint.location}</p>
                  <p className="text-xs text-slate-500">Status: {complaint.status.replace("_", " ")}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
