// src/pages/LoginPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./LoginPage.module.css"; // <<< 1. IMPORTE O ARQUIVO CSS MODULE
import FlashNoteLogo from "../assets/FlashNote.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState<string | null>(null); // Não é mais necessário se alert() for usado
  // const [successMessage, setSuccessMessage] = useState<string | null>(null); // Não é mais necessário
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

  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
	<img src={FlashNoteLogo} alt="FlashNote Logo" className={styles.logo} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="seu@email.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Sua senha"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p style={{ marginTop: "25px" }}>
          {" "}
          Não tem uma conta?{" "}
          <Link to="/register" className={styles.link}>
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
