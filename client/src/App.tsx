// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home/Editor</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/register">Registro</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EditorPage />} /> 
        <Route path="/doc/:slug" element={<EditorPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </div>
  );
}

export default App;