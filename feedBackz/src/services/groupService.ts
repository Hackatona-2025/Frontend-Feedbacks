import { apiClient, type ApiResponse } from './api';
import type { 
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupFilters,
  PaginatedResponse,
  User
} from '../types';

class GroupService {
  /**
   * Cria um novo grupo
   */
  async createGroup(groupData: CreateGroupRequest): Promise<ApiResponse<Group>> {
    return apiClient.post<Group>('/groups', groupData);
  }

  /**
   * Obtém todos os grupos com filtros e paginação
   */
  async getGroups(filters?: GroupFilters): Promise<ApiResponse<PaginatedResponse<Group>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/groups?${queryString}` : '/groups';
    
    return apiClient.get<PaginatedResponse<Group>>(endpoint);
  }

  /**
   * Obtém um grupo específico por ID
   */
  async getGroupById(id: string): Promise<ApiResponse<Group>> {
    return apiClient.get<Group>(`/groups/${id}`);
  }

  /**
   * Atualiza um grupo
   */
  async updateGroup(id: string, groupData: UpdateGroupRequest): Promise<ApiResponse<Group>> {
    return apiClient.put<Group>(`/groups/${id}`, groupData);
  }

  /**
   * Deleta um grupo
   */
  async deleteGroup(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/groups/${id}`);
  }

  /**
   * Entra em um grupo
   */
  async joinGroup(groupId: string): Promise<ApiResponse<{ message: string; group: Group }>> {
    return apiClient.post<{ message: string; group: Group }>(`/groups/${groupId}/join`);
  }

  /**
   * Sai de um grupo
   */
  async leaveGroup(groupId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/groups/${groupId}/leave`);
  }

  /**
   * Obtém membros de um grupo
   */
  async getGroupMembers(groupId: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`/groups/${groupId}/members`);
  }

  /**
   * Obtém grupos raiz (sem parent)
   */
  async getRootGroups(): Promise<ApiResponse<Group[]>> {
    return apiClient.get<Group[]>('/groups/roots');
  }

  /**
   * Obtém subgrupos de um grupo
   */
  async getSubgroups(parentId: string): Promise<ApiResponse<Group[]>> {
    return apiClient.get<Group[]>(`/groups/${parentId}/subgroups`);
  }

  /**
   * Obtém hierarquia completa de grupos
   */
  async getGroupHierarchy(): Promise<ApiResponse<Group[]>> {
    return apiClient.get<Group[]>('/groups/hierarchy');
  }

  /**
   * Obtém grupos do usuário atual
   */
  async getMyGroups(): Promise<ApiResponse<Group[]>> {
    return apiClient.get<Group[]>('/groups/my');
  }

  /**
   * Busca grupos por nome
   */
  async searchGroups(query: string, filters?: Omit<GroupFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<Group>>> {
    const params = new URLSearchParams({ search: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Group>>(`/groups/search?${params.toString()}`);
  }

  /**
   * Obtém estatísticas de um grupo
   */
  async getGroupStats(groupId: string): Promise<ApiResponse<{
    memberCount: number;
    feedbackCount: number;
    subgroupCount: number;
    totalReactions: number;
    topMembers: Array<{
      user: User;
      feedbackCount: number;
      reactionCount: number;
    }>;
  }>> {
    return apiClient.get(`/groups/${groupId}/stats`);
  }

  /**
   * Obtém estatísticas gerais de grupos
   */
  async getGroupsOverallStats(): Promise<ApiResponse<{
    totalGroups: number;
    totalMembers: number;
    averageMembersPerGroup: number;
    mostActiveGroups: Array<{
      group: Group;
      activityScore: number;
    }>;
  }>> {
    return apiClient.get('/groups/stats');
  }

  /**
   * Convida usuário para grupo (apenas admins)
   */
  async inviteUserToGroup(groupId: string, userEmail: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/groups/${groupId}/invite`, { userEmail });
  }

  /**
   * Remove usuário do grupo (apenas admins)
   */
  async removeUserFromGroup(groupId: string, userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/groups/${groupId}/members/${userId}`);
  }

  /**
   * Promove usuário a admin do grupo (apenas admins)
   */
  async promoteUserToAdmin(groupId: string, userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/groups/${groupId}/promote/${userId}`);
  }

  /**
   * Remove admin de usuário do grupo (apenas admins)
   */
  async demoteUserFromAdmin(groupId: string, userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/groups/${groupId}/demote/${userId}`);
  }

  /**
   * Verifica se usuário é membro de um grupo
   */
  async isUserMember(groupId: string): Promise<ApiResponse<{ isMember: boolean; isAdmin: boolean }>> {
    return apiClient.get<{ isMember: boolean; isAdmin: boolean }>(`/groups/${groupId}/membership`);
  }

  /**
   * Obtém grupos sugeridos para o usuário
   */
  async getSuggestedGroups(): Promise<ApiResponse<Group[]>> {
    return apiClient.get<Group[]>('/groups/suggestions');
  }
}

export const groupService = new GroupService(); 