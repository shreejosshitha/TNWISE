// Initialize dummy data for testing
const initDummyData = () => {
  // Check if data already exists
  if (localStorage.getItem('waterComplaints')) {
    console.log('Dummy data already exists');
    return;
  }

  const dummyComplaints = [
    {
      id: 'WCOMP001',
      title: 'No Water Supply',
      category: 'Water Supply',
      subcategory: 'Complete outage',
      description: 'No water supply for 3 days in Anna Nagar area',
      location: 'Anna Nagar, Chennai',
      lat: 13.0827,
      lng: 80.2707,
      status: 'submitted',
      date: new Date(Date.now() - 24*60*60*1000).toISOString()
    },
    {
      id: 'WCOMP002',
      title: 'Low Water Pressure',
      category: 'Water Pressure',
      subcategory: 'Low pressure',
      description: 'Very low water pressure in the mornings',
      location: 'T. Nagar, Chennai',
      lat: 13.0358,
      lng: 80.2440,
      status: 'assigned',
      date: new Date(Date.now() - 12*60*60*1000).toISOString()
    },
    {
      id: 'WCOMP003',
      title: 'Pipe Leakage',
      category: 'Infrastructure',
      subcategory: 'Pipe burst',
      description: 'Major pipe burst on main road causing flooding',
      location: 'Adyar, Chennai',
      lat: 13.0012,
      lng: 80.2565,
      status: 'in_progress',
      date: new Date(Date.now() - 6*60*60*1000).toISOString()
    }
  ];

  const dummyApplications = [
    {
      id: "WTR10001",
      type: "New Connection",
      status: "submitted",
      date: new Date(Date.now() - 48*60*60*1000).toISOString().split('T')[0],
      formData: {
        name: "Rajesh Kumar",
        phone: "9876543210",
        email: "rajesh@example.com",
        address: "123 Main St, Anna Nagar, Chennai",
        connectionType: "domestic",
        dateOfBirth: "1990-06-05",
        gender: "male",
        aadhar: "1234-5678-9012",
      },
      documents: {},
    },
    {
      id: "WTR10002",
      type: "Tap Repair",
      status: "submitted",
      date: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
      formData: {
        name: "Priya Sharma",
        phone: "9123456789",
        email: "priya@example.com",
        address: "456 Oak Ave, T. Nagar, Chennai",
        connectionType: "commercial",
        dateOfBirth: "1985-02-14",
        gender: "female",
        aadhar: "9876-5432-1098",
      },
      documents: {},
    }
  ];

  localStorage.setItem('waterComplaints', JSON.stringify(dummyComplaints));
  localStorage.setItem('waterApplications', JSON.stringify(dummyApplications));

  console.log('Dummy data initialized');
};

// Run initialization
initDummyData();