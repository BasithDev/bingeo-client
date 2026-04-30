import { apiClient } from "./client";
import { apiConfig } from "../config/api.config";
import type { IContentMetadata } from "@/features/admin/types/content.types";

interface IListDraftsResponse {
  data: IContentMetadata[];
}

interface IGetDraftResponse {
  data: IContentMetadata;
}

interface IUploadUrlResponse {
  data: {
    uploadUrl: string;
    key: string;
  };
}

interface IContentResponse {
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

  async markUpcoming(id: string) {
    const res = await apiClient.post<IContentResponse>(
      apiConfig.endpoints.content.markUpcoming(id),
    );
    return res.data;
  },

  async requestUploadUrl(id: string, fileName: string, contentType: string) {
    const res = await apiClient.post<IUploadUrlResponse>(
      apiConfig.endpoints.content.uploadUrl(id),
      { fileName, contentType },
    );
    return res.data;
  },

  async confirmUpload(id: string, videoKey: string) {
    const res = await apiClient.post<IContentResponse>(
      apiConfig.endpoints.content.uploadComplete(id),
      { videoKey },
    );
    return res.data;
  },

  async requestThumbnailUrl(id: string, fileName: string, contentType: string) {
    const res = await apiClient.post<IUploadUrlResponse>(
      apiConfig.endpoints.content.thumbnailUrl(id),
      { fileName, contentType },
    );
    return res.data;
  },

  async confirmThumbnail(id: string, thumbnailKey: string) {
    const res = await apiClient.post<IContentResponse>(
      apiConfig.endpoints.content.thumbnailComplete(id),
      { thumbnailKey },
    );
    return res.data;
  },
};
