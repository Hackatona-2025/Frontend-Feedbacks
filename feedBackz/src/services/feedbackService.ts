import { apiClient, type ApiResponse } from './api';
import type { 
  Feedback,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackFilters,
  PaginatedResponse
} from '../types';

class FeedbackService {
  /**
   * Cria um novo feedback
   */
  async createFeedback(feedbackData: CreateFeedbackRequest): Promise<ApiResponse<Feedback>> {
    return apiClient.post<Feedback>('/feedbacks', feedbackData);
  }

  /**
   * Obtém todos os feedbacks com filtros e paginação
   */
  async getFeedbacks(filters?: FeedbackFilters): Promise<ApiResponse<PaginatedResponse<Feedback>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/feedbacks?${queryString}` : '/feedbacks';
    
    return apiClient.get<PaginatedResponse<Feedback>>(endpoint);
  }

  /**
   * Obtém um feedback específico por ID
   */
  async getFeedbackById(id: string): Promise<ApiResponse<Feedback>> {
    return apiClient.get<Feedback>(`/feedbacks/${id}`);
  }

  /**
   * Atualiza um feedback
   */
  async updateFeedback(id: string, feedbackData: UpdateFeedbackRequest): Promise<ApiResponse<Feedback>> {
    return apiClient.put<Feedback>(`/feedbacks/${id}`, feedbackData);
  }

  /**
   * Deleta um feedback
   */
  async deleteFeedback(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/feedbacks/${id}`);
  }

  /**
   * Obtém feedbacks do usuário atual
   */
  async getMyFeedbacks(filters?: Omit<FeedbackFilters, 'authorId'>): Promise<ApiResponse<PaginatedResponse<Feedback>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/feedbacks/my?${queryString}` : '/feedbacks/my';
    
    return apiClient.get<PaginatedResponse<Feedback>>(endpoint);
  }

  /**
   * Obtém feedbacks de um grupo específico
   */
  async getFeedbacksByGroup(groupId: string, filters?: Omit<FeedbackFilters, 'groupId'>): Promise<ApiResponse<PaginatedResponse<Feedback>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/feedbacks/group/${groupId}?${queryString}` : `/feedbacks/group/${groupId}`;
    
    return apiClient.get<PaginatedResponse<Feedback>>(endpoint);
  }

  /**
   * Reporta um feedback
   */
  async reportFeedback(id: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/feedbacks/${id}/report`, { reason });
  }

  /**
   * Upload de arquivo para feedback
   */
  async uploadFile(file: FormData): Promise<ApiResponse<{ fileUrl: string }>> {
    // Para upload de arquivos, precisamos de headers específicos
    const response = await fetch(`${apiClient['baseUrl']}/feedbacks/upload`, {
      method: 'POST',
      headers: {
        // Não definir Content-Type para FormData, o browser define automaticamente
        ...(apiClient['token'] && { Authorization: `Bearer ${apiClient['token']}` }),
      },
      body: file,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Erro no upload',
        status: response.status,
        errors: data.errors,
      };
    }

    return {
      data: data.data || data,
      message: data.message,
      status: response.status,
    };
  }

  /**
   * Busca feedbacks por texto
   */
  async searchFeedbacks(query: string, filters?: Omit<FeedbackFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<Feedback>>> {
    const params = new URLSearchParams({ search: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Feedback>>(`/feedbacks/search?${params.toString()}`);
  }
}

export const feedbackService = new FeedbackService(); 