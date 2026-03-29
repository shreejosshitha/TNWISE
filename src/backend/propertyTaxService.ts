export interface TaxBreakdown {
  baseTax: number;
  waterTax: number;
  sewageTax: number;
  penalty: number;
  total: number;
}

export interface PropertyTaxRecord {
  propertyId: string;
  ownerName: string;
  address: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial';
  area: string;
  assessmentValue: number;
  breakdown: TaxBreakdown;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paymentHistory: Array<{
    amount: number;
    date: string;
    transactionId: string;
    method: 'UPI' | 'Card' | 'Net Banking';
  }>;
  reminders: Array<{
    message: string;
    date: string;
    type: 'due' | 'overdue';
  }>;
}

const STORAGE_KEY = "propertyTaxRecords";

const realTimeTaxData: PropertyTaxRecord[] = [
  // Residential - Pending
  {
    propertyId: "PTN00123456",
    ownerName: "Rajesh Kumar S",
    address: "Flat No. 4B, Sri Sai Apartments, 1st Main Road, Anna Nagar West Extn, Chennai - 600040",
    propertyType: "Residential",
    area: "1250 sq.ft",
    assessmentValue: 4850000,
    breakdown: {
      baseTax: 3880,
      waterTax: 970,
      sewageTax: 648,
      penalty: 0,
      total: 5498
    },
    dueDate: "2026-04-30",
    status: "pending",
    paymentHistory: [],
    reminders: []
  },
  // Commercial - Overdue with penalty
  {
    propertyId: "PTN00785678",
    ownerName: "Priya Sharma & Bros",
    address: "Shop No. 12-15, T. Nagar Commercial Complex, Usman Road, T. Nagar, Chennai - 600017",
    propertyType: "Commercial",
    area: "2850 sq.ft",
    assessmentValue: 17850000,
    breakdown: {
      baseTax: 14280,
      waterTax: 2130,
      sewageTax: 1420,
      penalty: 1670,
      total: 19500
    },
    dueDate: "2026-03-15",
    status: "overdue",
    paymentHistory: [],
    reminders: [
      {
        message: "Overdue by 25 days - ₹1670 penalty applied",
        date: "2026-04-09",
        type: "overdue"
      }
    ]
  },
  // Residential - Partial payment
  {
    propertyId: "PTN00344567",
    ownerName: "Arun Patel (HUF)",
    address: "Plot No. 78, Velachery Main Road, GST Road, Velachery, Chennai - 600042",
    propertyType: "Residential",
    area: "1950 sq.ft",
    assessmentValue: 7420000,
    breakdown: {
      baseTax: 5936,
      waterTax: 1114,
      sewageTax: 743,
      penalty: 0,
      total: 7793
    },
    dueDate: "2026-05-31",
    status: "partial",
    paymentHistory: [
      {
        amount: 4000,
        date: "2026-01-20",
        transactionId: "TXN202601200123",
        method: "UPI"
      },
      {
        amount: 1500,
        date: "2026-02-15",
        transactionId: "TXN202602150456",
        method: "Card"
      }
    ],
    reminders: []
  },
  // Industrial - Paid
  {
    propertyId: "PTN00987654",
    ownerName: "ABC Manufacturing Pvt Ltd",
    address: "Plot C-5, Industrial Estate, Ambattur, Chennai - 600058",
    propertyType: "Industrial",
    area: "4500 sq.ft",
    assessmentValue: 28500000,
    breakdown: {
      baseTax: 22800,
      waterTax: 4560,
      sewageTax: 3420,
      penalty: 0,
      total: 30780
    },
    dueDate: "2026-01-31",
    status: "paid",
    paymentHistory: [
      {
        amount: 30780,
        date: "2026-01-28",
        transactionId: "TXN202601280789",
        method: "Net Banking"
      }
    ],
    reminders: []
  },
  // Residential - Overdue (Test penalty)
  {
    propertyId: "PTN00567890",
    ownerName: "Sita Devi",
    address: "Door No. 56, 2nd Street, Nungambakkam High Road, Nungambakkam, Chennai - 600034",
    propertyType: "Residential",
    area: "850 sq.ft",
    assessmentValue: 3120000,
    breakdown: {
      baseTax: 2496,
      waterTax: 624,
      sewageTax: 416,
      penalty: 354,
      total: 3890
    },
    dueDate: "2026-02-28",
    status: "overdue",
    paymentHistory: [],
    reminders: []
  }
];

function getTaxData(): PropertyTaxRecord[] {
  if (typeof window === "undefined") return realTimeTaxData;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : realTimeTaxData;
  } catch {
    return realTimeTaxData;
  }
}

function saveTaxData(records: PropertyTaxRecord[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

function addReminder(propertyId: string, reminder: PropertyTaxRecord['reminders'][0]) {
  const records = getTaxData();
  const record = records.find(r => r.propertyId === propertyId);
  if (record) {
    record.reminders = [reminder, ...record.reminders.slice(0, 4)]; // Keep recent 5
    saveTaxData(records);
  }
}

export function getPropertyTaxRecord(propertyId: string): PropertyTaxRecord | null {
  return getTaxData().find(record => record.propertyId === propertyId) || null;
}

export function payPropertyTax(
  propertyId: string, 
  amount: number, 
  method: 'UPI' | 'Card' | 'Net Banking' = 'UPI'
): { transactionId: string; newRecord: PropertyTaxRecord } {
  const records = getTaxData();
  const recordIndex = records.findIndex(r => r.propertyId === propertyId);
  
  if (recordIndex === -1) {
    throw new Error("Property not found");
  }

  const record = records[recordIndex];
  const transactionId = `TXN${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const totalPaid = record.paymentHistory.reduce((sum, p) => sum + p.amount, 0) + amount;
  const remaining = record.breakdown.total - totalPaid;
  
  let newStatus: PropertyTaxRecord['status'] = 'partial';
  if (remaining <= 0) {
    newStatus = 'paid';
  } else if (totalPaid === 0) {
    newStatus = new Date(record.dueDate) < new Date() ? 'overdue' : 'pending';
  }

  // Update breakdown if partial payment reduces penalty (business logic)
  let updatedBreakdown = record.breakdown;
  if (newStatus === 'paid' && record.breakdown.penalty > 0) {
    updatedBreakdown = {
      ...record.breakdown,
      penalty: 0,
      total: record.breakdown.total - record.breakdown.penalty
    };
  }

  records[recordIndex] = {
    ...record,
    breakdown: updatedBreakdown,
    status: newStatus,
    paymentHistory: [
      ...record.paymentHistory.slice(-4),
      {
        amount,
        date: new Date().toISOString().split('T')[0],
        transactionId,
        method
      }
    ]
  };

  saveTaxData(records);

  return { transactionId, newRecord: records[recordIndex] };
}

export function getPaymentHistory(propertyId: string) {
  const record = getPropertyTaxRecord(propertyId);
  return record ? record.paymentHistory : [];
}

export function requestPropertyCorrection(propertyId: string, details: string) {
  const requestId = `CORR${Date.now().toString().slice(-6)}`;
  console.log(`Correction Request #${requestId} for ${propertyId}:`, details);
  
  // Simulate email/notification (toast called from UI)
  return requestId;
}

export function checkReminders(): PropertyTaxRecord['reminders'] {
  const today = new Date();
  const records = getTaxData();
  const activeReminders: PropertyTaxRecord['reminders'] = [];

  records.forEach(record => {
    const dueDate = new Date(record.dueDate);
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dueDate < today && record.status !== 'paid') {
      activeReminders.push({
        message: `${record.propertyId}: ₹${record.breakdown.total.toLocaleString()} overdue by ${daysOverdue} days`,
        date: today.toISOString().split('T')[0],
        type: "overdue"
      });
    }
  });

  return activeReminders;
}

