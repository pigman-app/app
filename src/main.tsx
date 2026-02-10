import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registrar Service Worker para PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Quando uma nova versão do app estiver disponível, atualiza automaticamente
    updateSW(true)
  },
  onOfflineReady() {
    console.log('PigMan está pronto para uso offline!')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
