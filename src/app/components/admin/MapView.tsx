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

export function MapView({ complaints }: MapViewProps) {
  const center = complaints.length ? [complaints[0].coordinates.lat, complaints[0].coordinates.lng] : [13.0358, 80.2440];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Complaint Heatmap</h3>
          <p className="text-sm text-slate-500">Interactive map with marker status and priority overlays.</p>
        </div>
      </div>
      <div className="mt-6 h-[420px] w-full overflow-hidden rounded-3xl">
        <MapContainer center={center as [number, number]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {complaints.map((complaint) => (
            <CircleMarker
              key={complaint._id}
              center={[complaint.coordinates.lat, complaint.coordinates.lng]}
              radius={10}
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
