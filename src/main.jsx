import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css'
import App from './App.jsx'
import CurrentLocation from './components/CurrentLocation.jsx'
import SearchCity from './components/SearchCity.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SearchCity />
    <CurrentLocation />
  </StrictMode>,
)
