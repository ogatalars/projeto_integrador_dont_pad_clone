// src/pages/LoginPage.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      await login(email, password);
      alert("Login bem-sucedido! Redirecionando..."); 
      navigate("/"); 
 
    } catch (err) {
      let errorMessage = "Ocorreu um erro desconhecido no login.";
      if (err instanceof Error) {
        errorMessage =
          err.message || "Falha no login. Verifique suas credenciais.";
      }
      alert(errorMessage); 
      setIsSubmitting(false);
    }
  };


  const pageStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 60px - 40px)",
    color: "white",
    padding: "20px",
  };
  const formContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "350px",
    padding: "25px",
    border: "1px solid #30363d",
    borderRadius: "8px",
    backgroundColor: "#161b22",
  };
  const inputStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
    fontSize: "1em",
  };
  const buttonStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#238636",
    color: "white",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "500",
  };
  const linkStyle: React.CSSProperties = {
    color: "#58a6ff",
    marginTop: "20px",
    textDecoration: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "5px",
    fontSize: "0.9em",
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#c9d1d9",
          }}
        >
          Login - Flashnote
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div>
            <label htmlFor="email" style={labelStyle}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" style={labelStyle}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="Sua senha"
            />
          </div>
          {/* Remova ou comente as linhas abaixo se for usar apenas alert() */}
          {/* {error && <p style={errorStyle}>{error}</p>} */}
          {/* {successMessage && <p style={successStyle}>{successMessage}</p>} */}
          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Não tem uma conta?{" "}
          <Link to="/register" style={linkStyle}>
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
