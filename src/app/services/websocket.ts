import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    const backendPort = import.meta.env.VITE_BACKEND_PORT || '3001';
    let socketUrl = '/'; // Prefer proxy
    
    // Fallback to direct if env set
    if (backendPort !== '3001') {
      socketUrl = `http://localhost:${backendPort}`;
    }

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 30000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    console.log(`🔄 Connecting to WebSocket: ${socketUrl}`);


  this.socket.on('connect', () => {
      console.log('🟢 Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Disconnected from WebSocket server:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error);
      this.handleReconnect();
    });

    return this.socket;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.connect();
      }, 2000 * this.reconnectAttempts); // Exponential backoff
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join-admin');
      console.log('📊 Joined admin room for real-time updates');
    }
  }

  joinCitizenRoom(phone: string) {
    if (this.socket) {
      this.socket.emit('join-citizen', phone);
      console.log('👤 Joined citizen room for tracking updates');
    }
  }

  onComplaintUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('complaint-updated', callback);
    }
  }

  onApplicationUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('application-updated', callback);
    }
  }

  onTrackingUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('tracking-updated', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();