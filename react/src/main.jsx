import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/toaster";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
<AuthProvider>
  <CartProvider>
    <App />
    <Toaster />
  </CartProvider>
</AuthProvider>
  </StrictMode>

)




