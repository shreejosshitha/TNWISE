import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { CheckCircle2, ClipboardList, Funnel, Search, Truck, UserPlus, Zap } from "lucide-react";
import type { AdminComplaint, ComplaintFilters } from "../../../backend/adminApi";

interface ComplaintTableProps {
  complaints: AdminComplaint[];
  selectedIds: string[];
  filters: ComplaintFilters;
  workers: string[];
  loading: boolean;
  onFilterChange: (filters: ComplaintFilters) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onAssign: (complaintId: string, assignedTo: string) => void;
  onStatusUpdate: (complaintId: string, status: string) => void;
  onBulkAssign: (assignedTo: string) => void;
  onBulkResolve: () => void;
}

const priorityStyles: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-sky-100 text-sky-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  REOPENED: "bg-orange-100 text-orange-700",
};

function computeAgeBadge(createdAt: string) {
  const ageHours = (Date.now() - parseISO(createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 48) return "Overdue";
  if (ageHours > 24) return "Warning";
  return "On track";
}

export function ComplaintTable({
  complaints,
  selectedIds,
  filters,
  workers,
  loading,
  onFilterChange,
  onToggleSelect,
  onToggleSelectAll,
  onAssign,
  onStatusUpdate,
  onBulkAssign,
  onBulkResolve,
}: ComplaintTableProps) {
  const selectionCount = selectedIds.length;

  const handleInput = (field: keyof ComplaintFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Complaint Management</h3>
          <p className="text-sm text-slate-500">Filter, search, assign and resolve complaints with SLA visibility.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <ClipboardList className="h-4 w-4 text-slate-400" /> {complaints.length} items
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Funnel className="h-4 w-4 text-slate-400" /> {filters.status || "All statuses"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Search</span>
          <div className="relative mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={filters.search ?? ""}
              onChange={(event) => handleInput("search", event.target.value)}
              placeholder="Complaint ID or keyword"
              className="w-full bg-transparent pl-10 text-sm text-slate-900 outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={filters.status ?? ""}
            onChange={(event) => handleInput("status", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            <option value="">All</option>
            <option value="NEW">NEW</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="REOPENED">REOPENED</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select
            value={filters.priority ?? ""}
            onChange={(event) => handleInput("priority", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            <option value="">All</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Area</span>
          <input
            type="text"
            value={filters.area ?? ""}
            onChange={(event) => handleInput("area", event.target.value)}
            placeholder="Ward or sector"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">From</span>
          <input
            type="date"
            value={filters.from ?? ""}
            onChange={(event) => handleInput("from", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">To</span>
          <input
            type="date"
            value={filters.to ?? ""}
            onChange={(event) => handleInput("to", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Sort</span>
          <select
            value={filters.sort ?? "latest"}
            onChange={(event) => handleInput("sort", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectionCount === complaints.length && complaints.length > 0}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
              </th>
              <th className="px-4 py-3">Complaint</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse bg-slate-50">
                    <td className="h-16 px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                  </tr>
                ))
              : complaints.map((complaint) => (
                  <tr key={complaint._id} id={`complaint-${complaint._id}`} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(complaint._id)}
                        onChange={() => onToggleSelect(complaint._id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{complaint.complaintId}</p>
                      <p className="text-xs text-slate-500">{complaint.type} · {complaint.location}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[complaint.status]}`}>
                        {complaint.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{complaint.assignedTo || "Unassigned"}</td>
                    <td className="px-4 py-4 text-slate-500">{formatDistanceToNowStrict(new Date(complaint.createdAt), { addSuffix: true })}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-2xl bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {computeAgeBadge(complaint.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      <button
                        type="button"
                        onClick={() => onAssign(complaint.complaintId, workers[0] ?? "Field Team")}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusUpdate(complaint.complaintId, complaint.status === "IN_PROGRESS" ? "RESOLVED" : "IN_PROGRESS")}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        <Zap className="h-3.5 w-3.5" /> {complaint.status === "IN_PROGRESS" ? "Resolve" : "In Progress"}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {selectionCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:px-6">
          <div className="text-sm text-slate-700">{selectionCount} selected</div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onBulkAssign(workers[0] ?? "Field Team")}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Truck className="h-4 w-4" /> Assign Selected
            </button>
            <button
              type="button"
              onClick={onBulkResolve}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
