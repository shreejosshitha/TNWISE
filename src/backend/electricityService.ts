import {
  citizensDatabase,
  CitizenProfile,
} from "./database";
import { AuthResponse } from "./authService";

export interface ElectricityBill {
  id: string;
  consumerNumber: string;
  phone: string;
  name: string;
  address: string;
  billMonth: string;
  billYear: number;
  unitsConsumed: number;
  ratePerUnit: number;
  billAmount: number;
  previousDues: number;
  totalAmount: number;
  dueDate: string;
  lastReading: number;
  currentReading: number;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
  createdAt: string;
}

export interface ElectricityComplaint {
  id: string;
  phone: string;
  consumerNumber?: string;
  type: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  resolvedDate?: string;
  createdAt: string;
}

export interface TimelineStep {
  id: number;
  title: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
  notes?: string;
}

export interface ElectricityApplication {
  id: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  loadType: "domestic" | "commercial" | "industrial";
  loadValue: number;
  purpose: string;
  status: "pending" | "docs-verified" | "site-inspected" | "approved" | "rejected" | "installed";
  applicationDate: string;
  documents: {
    identity: boolean;
    address: boolean;
    ownership: boolean;
  };
  fee: number;
  timeline: TimelineStep[];
}

export interface ElectricityPayment {
  id: string;
  consumerNumber: string;
  phone: string;
  amount: number;
  method: "UPI" | "Credit Card" | "Net Banking";
  status: "success" | "failed";
  transactionId: string;
  paidDate: string;
  billId: string;
}

// In-memory stores (extendable from database.ts)
let electricityBills: ElectricityBill[] = [
  // Rajesh Kumar TN10001234567
  {
    id: "bill_001",
    consumerNumber: "TN10001234567",
    phone: "9876543210",
    name: "Rajesh Kumar",
    address: "123, Anna Nagar, Chennai",
    billMonth: "March",
    billYear: 2026,
    unitsConsumed: 250,
    ratePerUnit: 5.0,
    billAmount: 1250,
    previousDues: 450,
    totalAmount: 1700,
    dueDate: "2026-04-05",
    lastReading: 2450,
    currentReading: 2700,
    status: "pending",
    createdAt: "2026-03-01",
  },
  {
    id: "bill_002",
    consumerNumber: "TN10001234567",
    phone: "9876543210",
    name: "Rajesh Kumar",
    address: "123, Anna Nagar, Chennai",
    billMonth: "February",
    billYear: 2026,
    unitsConsumed: 224,
    ratePerUnit: 5.0,
    billAmount: 1120,
    previousDues: 0,
    totalAmount: 1120,
    dueDate: "2026-03-05",
    lastReading: 2226,
    currentReading: 2450,
    status: "paid",
    paidDate: "2026-03-02",
    createdAt: "2026-02-01",
  },
  // Priya Patel KA20001234567
  {
    id: "bill_003",
    consumerNumber: "KA20001234567",
    phone: "9123456789",
    name: "Priya Patel",
    address: "456, Koramangala, Bangalore",
    billMonth: "March",
    billYear: 2026,
    unitsConsumed: 180,
    ratePerUnit: 4.8,
    billAmount: 864,
    previousDues: 0,
    totalAmount: 864,
    dueDate: "2026-04-10",
    lastReading: 1820,
    currentReading: 2000,
    status: "pending",
    createdAt: "2026-03-01",
  },
  // More seeds...
  {
    id: "bill_004",
    consumerNumber: "KA20002345678",
    phone: "8765432109",
    name: "Amit Singh",
    address: "789, Malleswaram, Bangalore",
    billMonth: "March",
    billYear: 2026,
    unitsConsumed: 320,
    ratePerUnit: 4.8,
    billAmount: 1536,
    previousDues: 200,
    totalAmount: 1736,
    dueDate: "2026-04-05",
    lastReading: 2680,
    currentReading: 3000,
    status: "pending",
    createdAt: "2026-03-01",
  },
  // Add 16+ more for history
  {
    id: "bill_005",
    consumerNumber: "KA20003456789",
    phone: "7654321098",
    name: "Sneha Desai",
    address: "321, MG Road, Bangalore",
    billMonth: "January",
    billYear: 2026,
    unitsConsumed: 150,
    ratePerUnit: 4.8,
    billAmount: 720,
    previousDues: 0,
    totalAmount: 720,
    dueDate: "2026-02-05",
    lastReading: 1850,
    currentReading: 2000,
    status: "paid",
    paidDate: "2026-01-28",
    createdAt: "2026-01-01",
  },
];

let electricityComplaints: ElectricityComplaint[] = [
  {
    id: "COMP1710838800000",
    phone: "9876543210",
    consumerNumber: "TN10001234567",
    type: "Power Outage",
    description: "No power since last night in Anna Nagar area",
    status: "pending",
    priority: "high",
    assignedTo: "Technician Ram",
    createdAt: "2026-03-22",
  },

  {
    id: "COMP1710666000000",
    phone: "9876543210",
    consumerNumber: "TN10001234567",
    type: "Voltage Fluctuation",
    description: "Frequent voltage drops affecting appliances",
    status: "resolved",
    priority: "medium",
    resolvedDate: "2026-03-12",
    createdAt: "2026-03-10",
  },
  // More...
];

let electricityApplications: ElectricityApplication[] = [
  {
    id: "EB1710752400000",
    phone: "9123456789",
    name: "Priya Patel",
    address: "456, Koramangala",
    city: "Bangalore",
    pincode: "560034",
    loadType: "domestic",
    loadValue: 2,
    purpose: "New residential connection",
    status: "pending",
    applicationDate: "2026-03-20",
    documents: { identity: true, address: true, ownership: true },
    fee: 720,
    timeline: [{id:1, title:"Submitted", status:"completed", date: "2026-03-20"}],
  },
  {
    id: "EB1710838800000",
    phone: "9876543210",
    name: "Rajesh Kumar",
    address: "123 Anna Nagar",
    city: "Chennai",
    pincode: "600040",
    loadType: "commercial",
    loadValue: 5,
    purpose: "New commercial connection",
    status: "docs-verified",
    applicationDate: "2026-03-22",
    documents: { identity: true, address: true, ownership: true },
    fee: 1200,
    timeline: [
      {id:1, title:"Submitted", status:"completed", date: "2026-03-22"},
      {id:2, title:"Docs Verified", status:"completed", date: "2026-03-23"}
    ],
  },
];

let electricityPayments: ElectricityPayment[] = [
  {
    id: "pay_001",
    consumerNumber: "TN10001234567",
    phone: "9876543210",
    amount: 1120,
    method: "UPI",
    status: "success",
    transactionId: "TXN123456789",
    paidDate: "2026-03-02",
    billId: "bill_002",
  },
  // More...
];

// Simulate network delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Service functions
export const getBillsByConsumerNumber = async (consumerNumber: string): Promise<AuthResponse> => {
  await simulateDelay();
  const bills = electricityBills.filter(b => b.consumerNumber === consumerNumber);
  return {
    success: true,
    message: `Found ${bills.length} bills`,
    data: bills,
  };
};

export const getBillHistory = async (consumerNumber: string): Promise<AuthResponse> => {
  await simulateDelay();
  const history = electricityBills.filter(b => b.consumerNumber === consumerNumber).slice(0, 12); // Last year
  return {
    success: true,
    message: `Payment history retrieved`,
    data: history,
  };
};


export const getBillById = async (billId: string): Promise<AuthResponse> => {
  await simulateDelay();
  const bill = electricityBills.find(b => b.id === billId);
  if (!bill) return { success: false, message: "Bill not found" };
  return { success: true, message: "Bill retrieved", data: bill };
};


export const fetchBillByConsumer = async (consumerNumber: string): Promise<AuthResponse> => {
  await simulateDelay();
  const bill = electricityBills.find(b => b.consumerNumber === consumerNumber && b.status === "pending");
  if (!bill) return { success: false, message: "No pending bill found" };
  return { success: true, message: "Bill fetched", data: bill };
};


export const payBill = async (billId: string, paymentData: { method: string; amount: number }): Promise<AuthResponse> => {
  await simulateDelay(2000);
  const billIndex = electricityBills.findIndex(b => b.id === billId);
  if (billIndex === -1) return { success: false, message: "Bill not found" };

  const bill = electricityBills[billIndex];
  const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  
  // Update bill
  electricityBills[billIndex] = {
    ...bill,
    status: "paid" as const,
    paidDate: new Date().toISOString().split('T')[0],
    previousDues: 0,
    totalAmount: paymentData.amount,
  };

  // Create payment record
  const payment: ElectricityPayment = {
    id: `pay_${Date.now()}`,
    consumerNumber: bill.consumerNumber,
    phone: bill.phone,
    amount: paymentData.amount,
    method: paymentData.method as ElectricityPayment['method'],
    status: "success",
    transactionId: txnId,
    paidDate: new Date().toISOString().split('T')[0],
    billId,
  };
  electricityPayments.push(payment);

  // Update other bills previousDues = 0
  electricityBills.forEach(b => {
    if (b.consumerNumber === bill.consumerNumber && b.status === "pending") {
      b.previousDues = 0;
    }
  });

  return {
    success: true,
    message: "Payment successful",
    data: { transactionId: txnId, bill: electricityBills[billIndex] },
  };
};

export const createComplaint = async (complaintData: Omit<ElectricityComplaint, 'id' | 'createdAt'>): Promise<AuthResponse> => {
  await simulateDelay();
  const complaint: ElectricityComplaint = {
    ...complaintData,
    id: `COMP${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    priority: "medium",
  };
  electricityComplaints.push(complaint);
  return { success: true, message: "Complaint created", data: complaint };
};

export const getComplaintsByPhone = async (phone: string): Promise<AuthResponse> => {
  await simulateDelay();
  const complaints = electricityComplaints.filter(c => c.phone === phone);
  return { success: true, message: `Complaints retrieved`, data: complaints };
};


// Note: Removed duplicate updateComplaintStatus (now enhanced admin version exists)



export const createApplication = async (appData: Omit<ElectricityApplication, 'id' | 'applicationDate' | 'timeline'>): Promise<AuthResponse> => {
  await simulateDelay();
  const app: ElectricityApplication = {
    ...appData,
    id: `EB${Date.now()}`,
    applicationDate: new Date().toISOString().split('T')[0],
    status: "pending",
    timeline: [{
      id: 1,
      title: "Application Submitted",
      status: "completed" as const,
      date: new Date().toISOString().split('T')[0]
    }]
  };
  electricityApplications.push(app);
  return { success: true, message: "Application submitted", data: app };
};

export const getApplicationsByPhone = async (phone: string): Promise<AuthResponse> => {
  await simulateDelay();
  const apps = electricityApplications.filter(a => a.phone === phone);
  return { success: true, message: `Applications retrieved`, data: apps };
};

export const getTrackingsByPhone = async (phone: string): Promise<AuthResponse> => {
  await simulateDelay();
  const complaints = electricityComplaints.filter(c => c.phone === phone);
  const apps = electricityApplications.filter(a => a.phone === phone);
  return { success: true, message: `Trackings retrieved`, data: { applications: apps, complaints } };
};

export const getApplicationById = async (id: string): Promise<AuthResponse> => {
  await simulateDelay();
  const app = electricityApplications.find(a => a.id === id);
  if (!app) return { success: false, message: "Application not found" };
  return { success: true, message: "Application retrieved", data: app };
};


export const getAdminStats = async (): Promise<AuthResponse> => {
  await simulateDelay();
  const totalApps = electricityApplications.length;
  const pendingComplaints = electricityComplaints.filter(c => c.status === "pending").length;
  const newConnections = electricityApplications.filter(a => a.status === "approved").length;
  const resolved = electricityComplaints.filter(c => c.status === "resolved").length;
  return {
    success: true,
    message: "Admin stats retrieved",
    data: {
      totalApplications: totalApps.toLocaleString(),
      pendingComplaints: pendingComplaints.toString(),
      newConnections: newConnections.toString(),
      resolvedCases: resolved.toString(),
      recentActivities: electricityPayments.slice(-4).map(p => ({
        id: `E${p.id.slice(0,4)}`,
        name: `${p.method} Payment - Ref#${p.billId}`,
        status: p.status,
        time: p.paidDate,
      })),
    },
  };
};

export const getAdminApplications = async (limit = 10): Promise<AuthResponse> => {
  await simulateDelay();
  const apps = electricityApplications.slice(0, limit);
  return { success: true, message: "Admin applications retrieved", data: apps };
};

export const getAdminComplaints = async (limit = 10): Promise<AuthResponse> => {
  await simulateDelay();
  const complaints = electricityComplaints.slice(0, limit);
  return { success: true, message: "Admin complaints retrieved", data: complaints };
};


// Admin functions

export const updateComplaintStatus = async (
  id: string, 
  status: ElectricityComplaint['status'], 
  assignedTo?: string,
  notes?: string
): Promise<AuthResponse> => {
  await simulateDelay(800);
  const index = electricityComplaints.findIndex(c => c.id === id);
  if (index === -1) return { success: false, message: "Complaint not found" };
  
  electricityComplaints[index].status = status;
  if (assignedTo) electricityComplaints[index].assignedTo = assignedTo;
  if (status === "resolved") {
    electricityComplaints[index].resolvedDate = new Date().toISOString();
  }
  return { 
    success: true, 
    message: "Complaint status updated", 
    data: electricityComplaints[index] 
  };
};

export interface ApplicationDecision {
  approved: boolean;
  documentsVerified: { identity: boolean; address: boolean; ownership: boolean };
  notes?: string;
  installationDate?: string;
}

export const approveApplication = async (
  id: string, 
  decision: ApplicationDecision
): Promise<AuthResponse> => {
  await simulateDelay(1000);
  const index = electricityApplications.findIndex(a => a.id === id);
  if (index === -1) return { success: false, message: "Application not found" };
  
  if (decision.approved) {
    electricityApplications[index].status = "approved";
    electricityApplications[index].documents = decision.documentsVerified;
    electricityApplications[index].timeline.push({
      id: 4,
      title: "Final Approval",
      status: "completed" as const,
      date: new Date().toISOString().split('T')[0]
    });
  } else {
    electricityApplications[index].status = "rejected";
    electricityApplications[index].timeline.push({
      id: 4,
      title: "Rejected",
      status: "completed" as const,
      date: new Date().toISOString().split('T')[0],
      notes: decision.notes || "Rejected by admin"
    });
  }
  
  return { 
    success: true, 
    message: decision.approved ? "Application approved" : "Application rejected", 
    data: electricityApplications[index] 
  };
};

export const updateApplicationStage = async (
  id: string,
  stage: "docs-verify" | "site-inspect" | "final-approve" | "install",
  notes?: string
): Promise<AuthResponse> => {
  await simulateDelay(800);
  const index = electricityApplications.findIndex(a => a.id === id);
  if (index === -1) return { success: false, message: "Application not found" };

  const app = electricityApplications[index];
  
  let title = "";
  let newStatus = app.status;
  
  switch (stage) {
    case "docs-verify":
      title = "Documents Verified";
      newStatus = "docs-verified";
      break;
    case "site-inspect":
      title = "Site Inspection Complete";
      newStatus = "site-inspected";
      break;
    case "final-approve":
      title = "Final Approval";
      newStatus = "approved";
      break;
    case "install":
      title = "Installation Complete";
      newStatus = "installed";
      break;
  }
  
  app.timeline.push({
    id: app.timeline.length + 1,
    title,
    status: "completed" as const,
    date: new Date().toISOString().split('T')[0],
    notes
  });
  
  app.status = newStatus;
  
  return {
    success: true,
    message: `${title} marked complete`,
    data: app
  };
};

export const getAdminBills = async (limit = 10, status?: string): Promise<AuthResponse> => {
  await simulateDelay();
  let bills = electricityBills;
  if (status) bills = bills.filter(b => b.status === status);
  const result = bills.slice(0, limit);
  return { 
    success: true, 
    message: "Admin bills retrieved", 
    data: result 
  };
};

export const searchAdminData = async (query: string): Promise<AuthResponse> => {
  await simulateDelay();
  const q = query.toLowerCase();
  const complaints = electricityComplaints.filter(c => 
    c.id.includes(query) || c.phone.includes(query) || c.description.toLowerCase().includes(q)
  );
  const apps = electricityApplications.filter(a => 
    a.id.includes(query) || a.phone.includes(query) || a.name.toLowerCase().includes(q)
  );
  const bills = electricityBills.filter(b => 
    b.id.includes(query) || b.consumerNumber.includes(query) || b.phone.includes(query)
  );
  return {
    success: true,
    message: "Search results",
    data: { complaints, applications: apps, bills }
  };
};

export const getDetailedAdminStats = async (fromDate?: string, toDate?: string): Promise<AuthResponse> => {
  await simulateDelay();
  const now = new Date();
  const start = fromDate ? new Date(fromDate) : new Date(now.getFullYear(), 0, 1);
  const end = toDate ? new Date(toDate) : now;
  
  const totalRevenue = electricityPayments
    .filter(p => new Date(p.paidDate) >= start && new Date(p.paidDate) <= end)
    .reduce((sum, p) => sum + p.amount, 0);
    
  const avgResolutionDays = electricityComplaints
    .filter(c => c.status === "resolved" && c.resolvedDate)
    .map(c => {
      const created = new Date(c.createdAt);
      const resolved = new Date(c.resolvedDate!);
      return (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    })
    .reduce((sum, days) => sum + days, 0) / (electricityComplaints.filter(c => c.status === "resolved").length || 1);
  
  return {
    success: true,
    message: "Detailed stats",
    data: {
      totalRevenue: totalRevenue.toLocaleString(),
      avgResolutionDays: avgResolutionDays.toFixed(1),
      monthlyPayments: electricityPayments.slice(-12).map(p => ({ month: p.paidDate, amount: p.amount })),
      // more metrics...
    }
  };
};

// Update citizen electricity service
export const linkConsumerNumber = async (phone: string, consumerNumber: string): Promise<AuthResponse> => {
  const citizen = Object.values(citizensDatabase).find(c => c.phone === phone);
  if (!citizen) return { success: false, message: "Citizen not found" };
  
  if (!citizen.services) citizen.services = {} as any;
  citizen.services.electricity = {
    consumerNumber,
    status: "active" as const,
    connectionDate: new Date().toISOString().split('T')[0],
  };
  
  // Update bills with citizen name/address if missing
  electricityBills.forEach(bill => {
    if (bill.phone === phone && (!bill.name || !bill.address)) {
      bill.name = citizen.name;
      bill.address = citizen.address;
    }
  });

  return { success: true, message: "Consumer number linked" };
};



