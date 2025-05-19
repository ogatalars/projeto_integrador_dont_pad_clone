// src/pages/RegisterPage.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    if (!email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos."); 
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem."); 
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password);
      alert("Registro bem-sucedido! Você será redirecionado para o login.");
      navigate("/login"); 
    } catch (err) {
      let errorMessage = "Ocorreu um erro desconhecido no registro.";
      if (err instanceof Error) {
        errorMessage = err.message || "Falha no registro. Tente novamente.";
      }
      alert(errorMessage); 
      setIsSubmitting(false);
    }

  };

  const pageStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "calc(100vh - 60px - 20px)", // Ajustado para RegisterPage
    color: "white", padding: "20px",
  };
  const formContainerStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", width: "100%", 
    maxWidth: "380px", padding: "30px", border: "1px solid #30363d", 
    borderRadius: "8px", backgroundColor: "#161b22", 
  };
  const inputStyle: React.CSSProperties = {
    padding: "12px", borderRadius: "6px", border: "1px solid #30363d",
    backgroundColor: "#0d1117", color: "#c9d1d9", fontSize: "1em", width: '100%',
  };
  const buttonStyle: React.CSSProperties = {
    padding: "12px", borderRadius: "6px", border: "none",
    backgroundColor: "#238636", color: "white", cursor: "pointer",
    fontSize: "1em", fontWeight: "500", width: '100%', marginTop: '10px',
  };
  const linkStyle: React.CSSProperties = {
    color: "#58a6ff", marginTop: "20px", textDecoration: "none",
  };
  const labelStyle: React.CSSProperties = { 
    display: "block", marginBottom: "5px", fontSize: '0.9em',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#c9d1d9' }}>Registrar - Flashnote</h2>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
          <div>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="seu@email.com" />
          </div>
          <div>
            <label htmlFor="password" style={labelStyle}>Senha:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirmar Senha:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="Repita a senha" />
          </div>
          

          
          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <p style={{ marginTop: "25px", textAlign: 'center' }}>
          Já tem uma conta?{" "}
          <Link to="/login" style={linkStyle}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;