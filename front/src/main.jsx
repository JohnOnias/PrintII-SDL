import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import Login from './pages/login/Login'; 
import Cadastro from './pages/cadastro/Cadastro';
import CadastroImovel from './pages/cadastroImovel/CadastroImovel';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota inicial carrega o Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rota para o cadastro de usuário */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota para o cadastro de imóveis */}
        <Route path="/cadastro-imovel" element={<CadastroImovel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
