import { apiClient } from "./client";
import { apiConfig } from "../config/api.config";
import type { IContentMetadata } from "@/features/admin/types/content.types";

interface IListDraftsResponse {
  data: IContentMetadata[];
}

interface IGetDraftResponse {
  data: IContentMetadata;
}

export const contentService = {
  async listDrafts() {
    const res = await apiClient.get<IListDraftsResponse>(apiConfig.endpoints.content.drafts);
    return res.data;
  },

  async getDraft(id: string) {
    const res = await apiClient.get<IGetDraftResponse>(apiConfig.endpoints.content.draftById(id));
    return res.data;
  },

  async saveDraft(draft: IContentMetadata) {
    return apiClient.put<{ message: string }>(
      apiConfig.endpoints.content.draftById(draft.id),
      draft,
    );
  },

  async deleteDraft(id: string) {
    return apiClient.delete<void>(apiConfig.endpoints.content.draftById(id));
  },
};

