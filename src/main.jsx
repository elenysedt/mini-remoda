import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider> {/* ✅ Aquí se activa el contexto del carrito */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
