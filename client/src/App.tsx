// src/App.tsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import MyDocumentsPage from './pages/MyDocumentsPage'; // <<< 1. IMPORTE A NOVA PÁGINA

function App() {
  const { isAuthenticated, logout, user } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Seus objetos de estilo (appContainerStyle, navStyle, etc.) permanecem os mesmos
  // Vou omiti-los aqui por brevidade, mas eles devem estar no seu código
  const appContainerStyle: React.CSSProperties = {
    margin: '0 auto',
    backgroundColor: '#0d1117',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid #30363d',
    backgroundColor: '#161b22',
    flexShrink: 0,
    height: '60px',
  };

  const navLinksStyle: React.CSSProperties = { // Estilo para o link "Flashnote" e "Meus Documentos"
    color: '#c9d1d9',
    textDecoration: 'none',
    fontSize: '1.1em', // Ajustado para consistência
    fontWeight: '500', // Um pouco menos bold que o título principal
    marginRight: '20px', // Espaçamento entre "Flashnote" e "Meus Documentos"
  };

  const mainTitleStyle: React.CSSProperties = { // Estilo específico para "Flashnote"
      ...navLinksStyle, // Herda de navLinksStyle
      fontSize: '1.2em',
      fontWeight: 'bold',
  };


  const authLinksContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const userInfoStyle: React.CSSProperties = {
    marginRight: '15px',
    fontSize: '0.9em',
    color: '#8b949e',
  };

  const authLinkStyle: React.CSSProperties = { // Para Login/Registro
    marginRight: '15px',
    color: '#58a6ff',
    textDecoration: 'none',
    fontSize: '0.95em',
  };

  const logoutButtonStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid #f85149',
    color: '#f85149',
    cursor: 'pointer',
    fontSize: '0.95em',
    padding: '5px 10px',
    borderRadius: '5px',
  };

  return (
    <div style={appContainerStyle}>
      <nav style={navStyle}>
        <div>
          <Link to="/" style={mainTitleStyle}>Flashnote</Link> {/* Título principal */}
          {isAuthenticated && ( // <<< 2. ADICIONE O LINK "MEUS DOCUMENTOS" AQUI
            <Link to="/meus-documentos" style={navLinksStyle}> 
              Meus Documentos
            </Link>
          )}
        </div>
        <div style={authLinksContainerStyle}>
          {isAuthenticated && user ? (
            <>
              <span style={userInfoStyle}>Logado como: {user.email}</span>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={authLinkStyle}>Login</Link>
              <Link to="/register" style={authLinkStyle}>Registro</Link>
            </>
          )}
        </div>
      </nav>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}> 
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