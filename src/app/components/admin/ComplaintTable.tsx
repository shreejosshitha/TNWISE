import { useEffect, useRef, useState } from "react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { CheckCircle2, ClipboardList, Funnel, Search, Truck, UserPlus } from "lucide-react";
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
  onRowClick?: (complaintId: string) => void;
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
  onRowClick,
  onAssign,
  onStatusUpdate,
  onBulkAssign,
  onBulkResolve,
}: ComplaintTableProps) {
  const [bulkAssignee, setBulkAssignee] = useState<string>(workers[0] || "");
  const selectAllRef = useRef<HTMLInputElement>(null);
  const allSelected = complaints.length > 0 && selectedIds.length === complaints.length;
  const partiallySelected = selectedIds.length > 0 && selectedIds.length < complaints.length;

  useEffect(() => {
    setBulkAssignee(workers[0] || "");
  }, [workers]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  const handleInput = (field: keyof ComplaintFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Complaint Management</h3>
        <span className="text-sm text-gray-500">{complaints.length} items</span>
      </div>

      {/* Filters */}
      <div className="grid gap-4 lg:grid-cols-4 mb-6">
        <input
          type="search"
          placeholder="Search..."
          value={filters.search ?? ""}
          onChange={(e) => handleInput("search", e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={filters.status ?? ""}
          onChange={(e) => handleInput("status", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="NEW">NEW</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <select
          value={filters.priority ?? ""}
          onChange={(e) => handleInput("priority", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700 font-semibold">
            {selectedIds.length} complaint{selectedIds.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={bulkAssignee}
              onChange={(e) => setBulkAssignee(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {workers.map((worker) => (
                <option key={worker} value={worker}>
                  {worker}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onBulkAssign(bulkAssignee)}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Assign selected
            </button>
            <button
              type="button"
              onClick={onBulkResolve}
              className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Resolve selected
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No complaints match your filters.
        </div>
      ) : (
        <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="px-2 py-3">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
              />
            </th>
            <th>Complaint</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Created</th>
            <th>SLA</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr
              key={c._id}
              className={`border-b hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(c._id)}
            >

              {/* Checkbox */}
              <td className="px-2 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c._id)}
                  onChange={() => onToggleSelect(c._id)}
                />
              </td>

              {/* Complaint */}
              <td>
                <div className="font-semibold">{c.complaintId}</div>
                <div className="text-xs text-gray-500">{c.description?.slice(0, 40)}</div>
              </td>

              {/* Status */}
              <td>
                <span className={`px-2 py-1 rounded ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
              </td>

              {/* Priority */}
              <td>
                <span className={`px-2 py-1 rounded ${priorityStyles[c.priority]}`}>
                  {c.priority}
                </span>
              </td>

              {/* Assigned */}
              <td>{c.assignedTo || "Unassigned"}</td>

              {/* Created */}
              <td>
                {formatDistanceToNowStrict(new Date(c.createdAt), { addSuffix: true })}
              </td>

              {/* SLA */}
              <td>{computeAgeBadge(c.createdAt)}</td>

              {/* Actions */}
              <td className="space-y-1">

                {/* NEW → ASSIGN */}
                {c.status === "NEW" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssign(c.complaintId, workers[0] || "Field Team");
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs w-full"
                  >
                    Assign
                  </button>
                )}

                {/* ASSIGNED → IN PROGRESS */}
                {c.status === "ASSIGNED" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(c.complaintId, "IN_PROGRESS");
                    }}
                    className="bg-orange-500 text-white px-2 py-1 rounded text-xs w-full"
                  >
                    In Progress
                  </button>
                )}

                {/* IN_PROGRESS → RESOLVED */}
                {c.status === "IN_PROGRESS" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(c.complaintId, "RESOLVED");
                    }}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs w-full"
                  >
                    Resolve
                  </button>
                )}

                {/* RESOLVED */}
                {c.status === "RESOLVED" && (
                  <span className="text-green-600 text-xs font-semibold">
                    Completed
                  </span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}