import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css'
import App from './App.jsx'

// Restore theme before first paint to prevent flash
// Defaults to light mode; dark mode only activates via toggle
const savedTheme = localStorage.getItem('locus_theme')
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
