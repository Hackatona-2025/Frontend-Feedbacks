import { apiClient, type ApiResponse } from './api';
import type { 
  Reaction,
  CreateReactionRequest,
  ReactionType
} from '../types';

class ReactionService {
  /**
   * Adiciona uma reação a um feedback
   */
  async createReaction(reactionData: CreateReactionRequest): Promise<ApiResponse<Reaction>> {
    return apiClient.post<Reaction>('/reactions', reactionData);
  }

  /**
   * Remove uma reação de um feedback
   */
  async removeReaction(feedbackId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/reactions/feedback/${feedbackId}`);
  }

  /**
   * Obtém todas as reações de um feedback
   */
  async getReactionsByFeedback(feedbackId: string): Promise<ApiResponse<Reaction[]>> {
    return apiClient.get<Reaction[]>(`/reactions/feedback/${feedbackId}`);
  }

  /**
   * Obtém contagem de reações por tipo para um feedback
   */
  async getReactionCounts(feedbackId: string): Promise<ApiResponse<Record<ReactionType, number>>> {
    return apiClient.get<Record<ReactionType, number>>(`/reactions/feedback/${feedbackId}/counts`);
  }

  /**
   * Obtém a reação do usuário atual para um feedback específico
   */
  async getMyReaction(feedbackId: string): Promise<ApiResponse<Reaction | null>> {
    return apiClient.get<Reaction | null>(`/reactions/feedback/${feedbackId}/my`);
  }

  /**
   * Atualiza uma reação existente (muda o tipo)
   */
  async updateReaction(feedbackId: string, type: ReactionType): Promise<ApiResponse<Reaction>> {
    return apiClient.put<Reaction>(`/reactions/feedback/${feedbackId}`, { type });
  }

  /**
   * Obtém todas as reações do usuário atual
   */
  async getMyReactions(): Promise<ApiResponse<Reaction[]>> {
    return apiClient.get<Reaction[]>('/reactions/my');
  }

  /**
   * Obtém estatísticas gerais de reações
   */
  async getReactionStats(): Promise<ApiResponse<{
    total: number;
    byType: Record<ReactionType, number>;
    mostReactedFeedbacks: Array<{
      feedbackId: string;
      totalReactions: number;
    }>;
  }>> {
    return apiClient.get('/reactions/stats');
  }

  /**
   * Toggle de reação - adiciona se não existe, remove se existe, ou atualiza se é diferente
   */
  async toggleReaction(feedbackId: string, type: ReactionType): Promise<ApiResponse<{
    reaction: Reaction | null;
    action: 'created' | 'updated' | 'removed';
  }>> {
    return apiClient.post<{
      reaction: Reaction | null;
      action: 'created' | 'updated' | 'removed';
    }>(`/reactions/toggle`, { feedbackId, type });
  }
}

export const reactionService = new ReactionService(); 