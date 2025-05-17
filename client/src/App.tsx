// src/App.tsx
import { Routes, Route, Link, useNavigate } from "react-router-dom"; // Adicionar useNavigate
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditorPage from "./pages/EditorPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute"; // <<< IMPORTAR
import { useAuth } from "./contexts/AuthContext"; // <<< IMPORTAR useAuth

function App() {
  const { isAuthenticated, logout } = useAuth(); // <<< USAR useAuth
  const navigate = useNavigate(); // Para o logout

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redireciona para login após logout
  };

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: "900px",
        padding: "20px",
        backgroundColor: "#0d1117",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #30363d",
          paddingBottom: "10px",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              marginRight: "15px",
              color: "#c9d1d9",
              textDecoration: "none",
              fontSize: "1.1em",
            }}
          >
            Flashnote Editor
          </Link>
          {/* Adicionaremos link "Meus Documentos" depois, se autenticado */}
        </div>
        <div>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                style={{ marginRight: "10px", color: "#58a6ff" }}
              >
                Login
              </Link>
              <Link to="/register" style={{ color: "#58a6ff" }}>
                Registro
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#f85149",
                cursor: "pointer",
                fontSize: "1em",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<EditorPage />} />
          <Route path="/doc/:slug" element={<EditorPage />} />
          {/* Outras rotas que precisam de autenticação podem vir aqui */}
        </Route>

        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
