// Dummy in-memory data - No MongoDB
// Reload on server restart

export let waterComplaints = [
  {
    complaintId: 'WCOMP001',
    phone: '9876543210',
    type: 'Water Supply',
    category: 'No Water Supply',
    subcategory: 'Complete outage',
    description: 'No water supply for 3 days in Anna Nagar.',
    location: '13.0827,80.2707 Anna Nagar, Chennai',
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), // yesterday
    updatedAt: new Date().toISOString()
  },
  {
    complaintId: 'WCOMP002',
    phone: '9123456789',
    type: 'Water Quality',
    category: 'Contaminated Water',
    subcategory: 'Bad odor',
    description: 'Yellow water with bad smell since morning.',
    location: '12.9716,77.5946 Koramangala, Bangalore',
    priority: 'MEDIUM',
    status: 'APPROVED',
    assignedTo: 'Ravi Kumar',
    assignedAt: new Date(Date.now() - 12*60*60*1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    complaintId: 'WCOMP003',
    phone: '8765432109',
    type: 'Infrastructure',
    category: 'Pipe Leakage',
    subcategory: 'Major leak',
    description: 'Big pipe burst on main road.',
    location: '12.9352,77.6245 Malleswaram, Bangalore',
    priority: 'HIGH',
    status: 'REJECTED',
    resolutionNotes: 'Not a water board pipe',
    updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
  }
];

export let waterConnections = [
  {
    connectionId: 'WCONN001',
    phone: '9876543210',
    applicantName: 'Rajesh Kumar',
    address: '123 Anna Nagar, Chennai',
    connectionType: 'domestic',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  },
  {
    connectionId: 'WCONN002',
    phone: '9123456789',
    applicantName: 'Priya Patel',
    address: '456 Koramangala, Bangalore',
    connectionType: 'commercial',
    status: 'APPROVED',
    verifiedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    connectionId: 'WCONN003',
    phone: '8765432109',
    applicantName: 'Amit Singh',
    address: '789 Malleswaram, Bangalore',
    connectionType: 'domestic',
    status: 'REJECTED',
    rejectionReason: 'Documents incomplete',
    updatedAt: new Date(Date.now() - 48*60*60*1000).toISOString()
  }
];

export let electricityComplaints = [
  {
    complaintId: 'ELCOMP001',
    phone: '9876543210',
    type: 'Power Supply',
    category: 'Outage',
    subcategory: 'Complete blackout',
    description: 'Power gone for 5 hours.',
    location: 'Anna Nagar, Chennai',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 6*60*60*1000).toISOString()
  },
  {
    complaintId: 'ELCOMP002',
    phone: '7654321098',
    type: 'Billing',
    category: 'Incorrect Bill',
    description: 'Bill double charged.',
    location: 'MG Road, Bangalore',
    priority: 'LOW',
    status: 'RESOLVED',
    updatedAt: new Date().toISOString()
  }
];

export let electricityConnections = [
  {
    connectionId: 'ELCONN001',
    phone: '9123456789',
    applicantName: 'Priya Patel',
    address: 'Koramangala, Bangalore',
    connectionType: 'commercial',
    status: 'VERIFIED',
    submittedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
  },
  {
    connectionId: 'ELCONN002',
    phone: '6543210987',
    applicantName: 'Vijay Kumar',
    address: 'Whitefield, Bangalore',
    connectionType: 'domestic',
    status: 'INSTALLED',
    installedAt: new Date().toISOString()
  }
];

// Export functions to generate new IDs
export const generateWaterComplaintId = () => `WCOMP${Date.now() % 1000000}`;
export const generateWaterConnectionId = () => `WCONN${Date.now() % 1000000}`;
export const generateElecComplaintId = () => `ELCOMP${Date.now() % 1000000}`;
export const generateElecConnectionId = () => `ELCONN${Date.now() % 1000000}`;

