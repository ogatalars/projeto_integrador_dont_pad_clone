// src/components/ProtectedRoute.tsx
import React from "react"; // React é necessário para React.FC e JSX
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Como não estamos usando props personalizadas no momento (além de 'children' que é implícito com Outlet),
// podemos omitir uma interface de props dedicada ou usar React.FC sem um tipo genérico específico.
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Para potencialmente redirecionar de volta após o login

  if (isLoading) {
    // Enquanto o AuthContext está verificando o token inicial (ex: em um refresh de página),
    // é uma boa ideia mostrar um estado de carregamento ou não renderizar nada
    // para evitar um "flash" da página de login antes do redirecionamento correto.
    return <div>Verificando autenticação...</div>; // Ou seu componente de Loading global
  }

  if (!isAuthenticated) {
    // Usuário não está autenticado, redireciona para a página de login.
    // 'state={{ from: location }}' é opcional, mas útil se você quiser
    // redirecionar o usuário de volta para a página que ele tentou acessar após o login.
    // 'replace' substitui a entrada atual no histórico de navegação.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário está autenticado, então renderiza o componente da rota filha (o <Outlet /> faz isso).
  return <Outlet />;
};

export default ProtectedRoute;
