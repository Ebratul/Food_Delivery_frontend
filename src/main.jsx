import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext.jsx";
import { queryClient } from "./lib/queryClient.js";
import { router } from "./router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
            <ThemeContext.Consumer>
              {({ theme }) => <Toaster theme={theme} position="top-right" richColors closeButton toastOptions={{ style: { borderRadius: 12 } }} />}
            </ThemeContext.Consumer>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
