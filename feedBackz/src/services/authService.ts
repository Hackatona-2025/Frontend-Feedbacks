import { apiClient, type ApiResponse } from './api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  UpdateUserRequest
} from '../types';

class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Realiza registro de novo usuário
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    
    // Remove o token do cliente
    apiClient.setToken(null);
    
    return response;
  }

  /**
   * Obtém o perfil do usuário atual
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/profile');
  }

  /**
   * Atualiza o perfil do usuário atual
   */
  async updateProfile(profileData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/auth/profile', profileData);
  }

  /**
   * Solicita redefinição de senha
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  }

  /**
   * Redefine a senha com token
   */
  async resetPassword(
    token: string, 
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      password: newPassword,
    });
  }

  /**
   * Verifica se o token atual é válido
   */
  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return apiClient.get<{ valid: boolean }>('/auth/verify-token');
  }

  /**
   * Refresh do token de autenticação
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Define o token no cliente API
   */
  setToken(token: string | null): void {
    apiClient.setToken(token);
  }

  /**
   * Obtém dados de moedas do usuário
   */
  async getUserCoins(): Promise<ApiResponse<{ coins: number }>> {
    return apiClient.get<{ coins: number }>('/auth/coins');
  }
}

export const authService = new AuthService(); 