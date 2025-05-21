(function () {
  const redirect = sessionStorage.getItem("redirect"); // Usar getItem
  if (redirect) {
    sessionStorage.removeItem("redirect"); // Limpa após o uso
    if (redirect !== window.location.href) {
      window.history.replaceState(null, "", redirect); // Atualiza a URL sem recarregar a página
    }
  }
})();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {" "}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
