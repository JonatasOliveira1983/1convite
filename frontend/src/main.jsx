import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-recuperação quando um chunk antigo falha após novo deploy no Cloudflare Pages
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const key = '1convite_preload_reload';
  const last = Number(sessionStorage.getItem(key) || '0');
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(key, String(Date.now()));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
