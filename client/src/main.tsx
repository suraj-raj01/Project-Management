import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: "rounded-sm",
      }}
    />
  </React.StrictMode>,
)