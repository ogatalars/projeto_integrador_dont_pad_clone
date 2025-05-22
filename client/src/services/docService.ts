// client/src/services/docService.ts
import apiClient from "./api";

export interface DocumentApiResponse {
  id: number;
  slug: string;
  content: string;
  ownerId: number;
  editToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentData {
  slug: string;
  content: string;
  updatedAt: string;
}

export interface UserDocumentListItem {
  slug: string;
  updatedAt: string;
}

export interface CreateDocumentResponse {
  message: string;
  slug: string;
  document: DocumentApiResponse;
}

export interface EditTokenResponse {
  message: string;
  slug: string;
  editToken: string;
}

export const getDocument = async (slug: string): Promise<DocumentData> => {
  const response = await apiClient.get<DocumentData>(`/docs/${slug}`);
  return response.data;
};

export const createNewDocument = async (
  initialContent: string = ""
): Promise<CreateDocumentResponse> => {
  const response = await apiClient.post<CreateDocumentResponse>("/docs", {
    content: initialContent,
  });
  return response.data;
};

export const updateDocumentContent = async (
  slug: string,
  content: string,
  editToken?: string | null
): Promise<{ message: string; slug: string; updatedAt: string }> => {
  const headers: Record<string, string> = {};
  if (editToken) {
    headers["X-Edit-Token"] = editToken;
  }
  const response = await apiClient.put(
    `/docs/${slug}`,
    { content },
    { headers }
  );
  return response.data;
};

export const getUserDocumentsList = async (): Promise<
  UserDocumentListItem[]
> => {
  const response = await apiClient.get<UserDocumentListItem[]>("/docs");
  return response.data;
};

export const generateEditToken = async (
  slug: string
): Promise<EditTokenResponse> => {
  const response = await apiClient.post<EditTokenResponse>(
    `/docs/${slug}/edit-token`
  );
  return response.data;
};

export const deleteDocument = async (
  slug: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/docs/${slug}`);
  return response.data;
};
