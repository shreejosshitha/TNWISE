import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    ward: { type: String, required: true },
    area: { type: String, required: true },
    priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
    status: {
      type: String,
      enum: ["NEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"],
      default: "NEW",
    },
    assignedTo: { type: String, default: null },
    assignedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    resolutionNotes: { type: String, default: "" },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  {
    timestamps: false,
  }
);

ComplaintSchema.index({ status: 1, priority: 1, ward: 1, area: 1, createdAt: -1 });
ComplaintSchema.index({ complaintId: 1 });

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
