import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a0038',
                color: '#ffffff',
                border: '1px solid rgba(139,0,255,0.35)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                boxShadow: '0 0 20px rgba(139,0,255,0.25)',
              },
              success: { iconTheme: { primary: '#00ff88', secondary: '#1a0038' } },
              error:   { iconTheme: { primary: '#ff3355', secondary: '#1a0038' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
