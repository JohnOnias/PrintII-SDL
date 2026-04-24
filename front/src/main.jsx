import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import CadastroImovel from './pages/cadastroImovel/CadastroImovel';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CadastroImovel />
  </StrictMode>,
)
