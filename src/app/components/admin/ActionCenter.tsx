import { formatDistanceToNowStrict } from "date-fns";
import { ArrowRight, Clock3, Flag, MapPin, ShieldCheck, UserPlus, Eye } from "lucide-react";
import type { AdminComplaint } from "../../../backend/adminApi";

interface ActionCenterProps {
  items: AdminComplaint[];
  workers: string[];
  onAssign: (complaintId: string, assignedTo: string) => void;
  onView: (complaintId: string) => void;
}

const priorityClass = {
  HIGH: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
};

const statusClass = {
  NEW: "bg-slate-100 text-slate-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-sky-100 text-sky-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  REOPENED: "bg-orange-100 text-orange-700",
};

export function ActionCenter({ items, workers, onAssign, onView }: ActionCenterProps) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
        No critical complaints available right now.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.slice(0, 3).map((complaint) => (
        <div key={complaint._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Action Center</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{complaint.complaintId}</h3>
              <p className="mt-2 text-sm text-slate-500">{complaint.type} — {complaint.subcategory}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass[complaint.priority]}`}>{complaint.priority}</span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {complaint.location}</p>
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-400" /> {formatDistanceToNowStrict(new Date(complaint.createdAt), { addSuffix: true })}</p>
            <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass[complaint.status]}`}>{complaint.status.replace("_", " ")}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onAssign(complaint.complaintId, workers[0] ?? "Field Team")}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4" /> Assign
            </button>
            <button
              type="button"
              onClick={() => onView(complaint.complaintId)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Eye className="h-4 w-4" /> View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
