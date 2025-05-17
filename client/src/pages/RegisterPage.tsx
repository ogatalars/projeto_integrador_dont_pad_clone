// src/pages/RegisterPage.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsSubmitting(false);
      return;
    }

    try {
      await register(email, password);
      setSuccessMessage(
        "Registro bem-sucedido! Você será redirecionado para o login em breve."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redireciona após 3 segundos
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Falha no registro. Tente novamente.");
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reutilizando estilos da LoginPage para consistência
  const pageStyle: React.CSSProperties = {
    /* ... (copie de LoginPage) ... */
  };
  const formStyle: React.CSSProperties = {
    /* ... (copie de LoginPage) ... */
  };
  const inputStyle: React.CSSProperties = {
    /* ... (copie de LoginPage) ... */
  };
  const buttonStyle: React.CSSProperties = {
    /* ... (copie de LoginPage) ... */
  };
  const errorStyle: React.CSSProperties = {
    color: "red",
    marginBottom: "10px",
  };
  const successStyle: React.CSSProperties = {
    color: "green",
    marginBottom: "10px",
  };
  const linkStyle: React.CSSProperties = {
    color: "#61dafb",
    marginTop: "15px",
    textDecoration: "none",
  };

  // Copie os objetos de estilo pageStyle, formStyle, inputStyle, buttonStyle de LoginPage.tsx
  // para manter a consistência visual ou, idealmente, mova-os para um arquivo CSS/módulo CSS.
  // Por simplicidade, vou repetir aqui, mas em um projeto real, reutilize/centralize.
  pageStyle.minHeight = "85vh"; // Um pouco mais de espaço para o campo extra

  return (
    <div style={pageStyle}>
      <h2>Registrar - Flashnote</h2>
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
            minLength={6}
            style={inputStyle}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Confirmar Senha:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
            placeholder="Repita a senha"
          />
        </div>
        {error && <p style={errorStyle}>{error}</p>}
        {successMessage && <p style={successStyle}>{successMessage}</p>}
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
          {isSubmitting ? "Registrando..." : "Registrar"}
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        Já tem uma conta?{" "}
        <Link to="/login" style={linkStyle}>
          Faça login
        </Link>
      </p>
    </div>
  );
};
// Estilos para copiar de LoginPage (para manter este exemplo conciso, apenas um lembrete)
export default RegisterPage;