import api from '../lib/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  batch?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    batch?: string;
    role?: string;
  };
}

// Register new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Logout user
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Update user profile
export const updateProfile = async (data: Partial<RegisterData>) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

// Verify email
export const verifyEmail = async (token: string) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

// Resend verification email
export const resendVerification = async (email: string) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};
