// src/pages/LoginPage.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link para ir para registro
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      await login(email, password);
      // Se o login for bem-sucedido, o AuthContext vai atualizar o estado
      // e podemos redirecionar para a página principal ou uma página de "novo documento".
      // O AuthProvider pode ter uma lógica para redirecionar se já autenticado,
      // ou podemos fazer isso aqui.
      navigate("/"); // Redireciona para a home (que é o EditorPage)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Falha no login. Verifique suas credenciais.");
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aplicando um estilo básico inline para simular o design escuro
  const pageStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh", // Ajuste conforme necessário após a navbar
    // backgroundColor: 'black', // O body já deve estar preto pelo seu CSS
    color: "white",
    padding: "20px",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px", // Largura do formulário
    padding: "20px",
    border: "1px solid #333",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "white",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff", // Um azul para destaque
    color: "white",
    cursor: "pointer",
    fontSize: "1em",
  };

  const errorStyle: React.CSSProperties = {
    color: "red",
    marginBottom: "10px",
  };

  const linkStyle: React.CSSProperties = {
    color: "#61dafb", // Cor para o link
    marginTop: "15px",
    textDecoration: "none",
  };

  return (
    <div style={pageStyle}>
      <h2>Login - Flashnote</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
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
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
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
        {error && <p style={errorStyle}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Não tem uma conta?{" "}
        <Link to="/register" style={linkStyle}>
          Registre-se aqui
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
