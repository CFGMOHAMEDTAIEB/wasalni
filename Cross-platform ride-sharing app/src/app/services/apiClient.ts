// API Client Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'normal' | 'owner';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'normal' | 'owner';
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'normal' | 'owner' | 'guest';
    avatar?: string;
    verified: boolean;
    rating?: number;
    reviews?: number;
  };
}

export interface UserExistsRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

class APIClient {
  private baseURL = API_BASE_URL;
  private token: string | null = localStorage.getItem('authToken');

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (this.token && !headers.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  async checkUserExists(email: string): Promise<{ exists: boolean; message: string }> {
    try {
      return await this.request('/auth/check-email', {
        method: 'POST',
        body: { email },
      });
    } catch (error) {
      // If endpoint doesn't exist, we can still proceed
      return { exists: false, message: 'Check not available' };
    }
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return this.request('/auth/request-password-reset', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(data: PasswordResetConfirm): Promise<{ message: string }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: data,
    });
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return this.request('/auth/refresh-token', {
      method: 'POST',
      body: { refreshToken },
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  // Health check
  async health(): Promise<{ status: string; message: string }> {
    try {
      return await this.request('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiClient = new APIClient();
