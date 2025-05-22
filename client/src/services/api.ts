import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseURL) {
  console.error(
    "VITE_API_BASE_URL não está definida. " +
      "Certifique-se de que você criou um arquivo .env na pasta 'client' " +
      "e definiu VITE_API_BASE_URL=http://localhost:5001/api (ou sua URL da API)."
  );
}

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Erro 401: Não autorizado. Possível token expirado.");
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
