import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';

import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import CadastroImovel from './pages/cadastroImovel/CadastroImovel';
import Perfil from './pages/perfil/Perfil';
import EditarPerfil from "./pages/editarPerfil/EditarPerfil";
import Inicio from "./pages/inicio/Inicio"; // ✅ corrigido
import EscolhaTipo from "./pages/escolha/escolha";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* INÍCIO (DASHBOARD REAL) */}
        <Route path="/dashboard" element={<Inicio />} /> {/* ✅ corrigido */}
        <Route path="/inicio" element={<Inicio />} />

        {/* Perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Editar Perfil */}
        <Route path="/editarPerfil" element={<EditarPerfil />} />

        {/* Cadastro de imóvel */}
        <Route path="/cadastro-imovel" element={<CadastroImovel />} />

<Route path="/escolha" element={<EscolhaTipo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);