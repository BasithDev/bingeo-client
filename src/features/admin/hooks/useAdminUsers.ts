import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { apiConfig } from '@/services/config/api.config';
import type { AdminUser } from '../types/admin.types';

interface IGetUsersParams {
  page: number;
  pageSize: number;
  search?: string;
  plan?: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

interface IGetUsersResponse {
  data: AdminUser[];
  total: number;
}

export const adminKeys = {
  all: ['admin'] as const,
  users: (params: IGetUsersParams) => ['admin', 'users', params] as const,
};

export function useAdminUsers(params: IGetUsersParams) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', params.page.toString());
      searchParams.set('pageSize', params.pageSize.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.plan) searchParams.set('plan', params.plan);
      searchParams.set('sortBy', params.sortBy);
      searchParams.set('sortDir', params.sortDir);

      return apiClient.get<IGetUsersResponse>(`${apiConfig.endpoints.admin.users}?${searchParams.toString()}`);
    },
  });
}

export function useToggleBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.post<{ message: string; isBlocked: boolean }>(apiConfig.endpoints.admin.toggleUserBlock(userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}
