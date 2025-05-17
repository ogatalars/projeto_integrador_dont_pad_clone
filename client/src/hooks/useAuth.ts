// src/hooks/useAuth.ts
// import { useContext } from "react";
// Precisaremos importar o AuthContext e AuthContextType de AuthContext.tsx
// Isso cria uma dependência circular se AuthContextType estiver no mesmo arquivo
// e AuthContext.tsx importar useAuth. Vamos ajustar AuthContext.tsx para exportar AuthContextType.
// Por enquanto, vamos definir AuthContextType aqui temporariamente e ajustar depois.
// A melhor solução é AuthContext.tsx exportar AuthContextType e o AuthContext em si.

// Vamos adiar a movimentação do hook para evitar complexidade de importação circular agora
// e focar nos erros de 'any'. Se o erro do react-refresh persistir e incomodar, voltamos aqui.
// Por enquanto, ignore esta etapa de mover o useAuth.
