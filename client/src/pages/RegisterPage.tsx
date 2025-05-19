import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./RegisterPage.module.css"; 

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



  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Registrar - Flashnote</h2>
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
              minLength={6}
              className={styles.input}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
              placeholder="Repita a senha"
            />
          </div>
        
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <p style={{ marginTop: "25px" }}>
          {" "}
          Já tem uma conta?{" "}
          <Link to="/login" className={styles.link}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
