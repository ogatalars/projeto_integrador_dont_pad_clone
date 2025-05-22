// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import apiClient from "../services/api";
import axios, { AxiosError } from "axios";

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailInput: string, passwordInput: string) => Promise<void>;
  logout: () => void;
  register: (emailInput: string, passwordInput: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Tipagem para a estrutura esperada de erro da API (opcional, mas útil)
interface ApiErrorData {
  message: string;
  errors?: Array<{ msg: string; param?: string }>;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      apiClient
        .get("/auth/me")
        .then((response) => {
          setUser(response.data as User);
        })
        .catch((error: unknown) => {
          let errorMessage =
            "Falha ao validar token inicial ou buscar usuário.";
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorData>;
            errorMessage =
              axiosError.response?.data?.message || axiosError.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          console.error(errorMessage, error);

          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (emailInput: string, passwordInput: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        email: emailInput,
        password: passwordInput,
      });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("authToken", newToken);
      setToken(newToken);
      setUser(userData as User);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      let errorMessage = "Falha no login.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(errorMessage, error);

      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (emailInput: string, passwordInput: string) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/register", {
        email: emailInput,
        password: passwordInput,
      });
    } catch (error: unknown) {
      let errorMessage = "Falha no registro.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorData>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
