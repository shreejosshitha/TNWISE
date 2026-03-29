// Water API Client
// Backend: http://localhost:3001/api/water (assume same backend structure)

const BASE_URL = '/api/water';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export const waterApi = {
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

async createConnection(connectionData: any, token: string): Promise<ApiResponse<any>> {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const response = await fetch(`${BASE_URL}/connections`, {
      method: 'POST',
      headers,
      body: JSON.stringify(connectionData),
    });
    return response.json();
  },

  async createApplication(appData: any, token: string): Promise<ApiResponse<any>> {
    return waterApi.createConnection(appData, token);
  },

  async getApplicationById(id: string, token?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${BASE_URL}/tracker/${id}`, { headers });
    return response.json();
  },
};

