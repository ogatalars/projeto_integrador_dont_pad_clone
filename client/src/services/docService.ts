// client/src/services/docService.ts
import apiClient from "./api";

// 1. DEFINA AS INTERFACES DIRETAMENTE NO FRONTEND
// Esta interface representa a estrutura de um documento como recebido da API
export interface DocumentApiResponse {
  id: number;
  slug: string;
  content: string;
  ownerId: number; // O frontend pode precisar disso para lógica de UI, ex: "é meu documento?"
  editToken?: string | null; // Pode vir ou não da API, dependendo do endpoint
  createdAt: string; // Datas geralmente vêm como strings de APIs JSON
  updatedAt: string;
}

// Interface para o que esperamos da API ao buscar um documento específico para leitura
// Pode ser a mesma que DocumentApiResponse ou mais simples se menos campos forem retornados
export interface DocumentData {
  slug: string;
  content: string;
  updatedAt: string;
}

// Interface para a lista de documentos do usuário
export interface UserDocumentListItem {
  slug: string;
  updatedAt: string;
}

// Interface para resposta da criação de documento
export interface CreateDocumentResponse {
  message: string;
  slug: string;
  document: DocumentApiResponse; // <<< Usando a interface definida no frontend
}

// Interface para resposta do token de edição
export interface EditTokenResponse {
  message: string;
  slug: string;
  editToken: string;
}

// 2. AS FUNÇÕES DO SERVIÇO AGORA USAM ESSAS INTERFACES LOCAIS
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
  // Tipo de retorno ajustado
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
