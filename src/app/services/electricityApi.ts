// Electricity API Client
// Backend: http://localhost:3001

const BASE_URL = 'http://localhost:3001/api/electricity';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export const electricityApi = {
  async fetchBill(consumerNumber: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${BASE_URL}/bill/${consumerNumber}`);
    return response.json();
  },

  async getBillHistory(consumerNumber: string): Promise<ApiResponse<any[]>> {
    const response = await fetch(`${BASE_URL}/history/${consumerNumber}`);
    return response.json();
  },

  async payBill(billId: string, paymentData: { method: string; amount: number }, token?: string): Promise<ApiResponse<any>> {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}/pay`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ billId, ...paymentData }),
    });
    return response.json();
  },

  async createComplaint(complaintData: any, token: string): Promise<ApiResponse<any>> {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const response = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers,
      body: JSON.stringify(complaintData),
    });
    return response.json();
  },

  async getTrackings(token: string): Promise<ApiResponse<any>> {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await fetch(`${BASE_URL}/tracking`, {
      headers,
    });
    return response.json();
  },

  async createApplication(appData: any, token: string): Promise<ApiResponse<any>> {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(appData),
    });
    return response.json();
  },

  // Admin
  async getAdminStats(): Promise<ApiResponse<any>> {
    const response = await fetch('http://localhost:3001/api/admin/electricity/stats');
    return response.json();
  },

  async getAdminApplications(limit = 10): Promise<ApiResponse<any>> {
    const response = await fetch(`http://localhost:3001/api/admin/electricity/applications?limit=${limit}`);
    return response.json();
  },

  async getAdminComplaints(limit = 10): Promise<ApiResponse<any>> {
    const response = await fetch(`http://localhost:3001/api/admin/electricity/complaints?limit=${limit}`);
    return response.json();
  },

  // New admin methods
  async updateComplaintStatus(id: string, data: { status: string; assignedTo?: string; notes?: string }, token: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const response = await fetch(`http://localhost:3001/api/admin/electricity/complaints/${id}/status`, {
      method: 'PUT',
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
    });
    return response.json();
  },



  async approveApplication(id: string, decision: any, token: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const response = await fetch(`http://localhost:3001/api/admin/electricity/applications/${id}/approve`, {
      method: 'PUT',
      headers: headers as HeadersInit,
      body: JSON.stringify(decision),
    });
    return response.json();
  },


  async getAdminBills(limit = 10, status?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (status) params.append('status', status);
    const response = await fetch(`http://localhost:3001/api/admin/electricity/bills?${params.toString()}`);
    return response.json();
  },

  async searchAdmin(q: string): Promise<ApiResponse<any>> {
    const response = await fetch(`http://localhost:3001/api/admin/electricity/search?q=${encodeURIComponent(q)}`);
    return response.json();
  },

  async getDetailedAdminStats(from?: string, to?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const url = `http://localhost:3001/api/admin/electricity/stats-detailed${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  async getApplicationById(id: string, token?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`http://localhost:3001/api/electricity/tracker/${id}`, { headers });
    return response.json();
  },

  async updateApplicationStage(id: string, stage: string, notes?: string, token: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    };
    const body = { stage, notes };
    const response = await fetch(`http://localhost:3001/api/admin/electricity/applications/${id}/stage`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return response.json();
  },
};


