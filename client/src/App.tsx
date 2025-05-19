// src/App.tsx
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditorPage from "./pages/EditorPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyDocumentsPage from "./pages/MyDocumentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import styles from "./App.module.css"; // <<< 1. IMPORTE O ARQUIVO CSS MODULE

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (

    <div className={styles.appContainer}>
      <nav className={styles.nav}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {" "}
          {/* Wrapper para links da esquerda */}
          <Link to="/" className={styles.navBrandLink}>
            Flashnote
          </Link>
          {isAuthenticated && (
            <Link to="/meus-documentos" className={styles.navLink}>
              Meus Documentos
            </Link>
          )}
        </div>
        <div className={styles.authLinksContainer}>
          {isAuthenticated && user ? (
            <>
              <span className={styles.userInfo}>Logado como: {user.email}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>
                Login
              </Link>
              <Link to="/register" className={styles.authLink}>
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<EditorPage />} />
            <Route path="/doc/:slug" element={<EditorPage />} />
            <Route path="/meus-documentos" element={<MyDocumentsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
