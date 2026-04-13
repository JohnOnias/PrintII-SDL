import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Login from './pages/login/Login'; 
import Cadastro from './pages/cadastro/Cadastro'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cadastro/>
  </StrictMode>,
)
