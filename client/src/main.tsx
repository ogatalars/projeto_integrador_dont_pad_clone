(function () {
  const redirect = sessionStorage.getItem("redirect"); 
  if (redirect) {
    sessionStorage.removeItem("redirect"); 
    if (redirect !== window.location.href) {
      window.history.replaceState(null, "", redirect); 
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
    <BrowserRouter basename="/projeto_integrador_dont_pad_clone"> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);