import { createBrowserRouter, Navigate } from "react-router-dom";

import LayoutPrivado from "../components/layout/LayoutPrivado";

// pages
import Login from "../pages/login/Login"; 
import Cadastro from "../pages/cadastro/Cadastro";
import Perfil from "../pages/perfil/Perfil";
import EditarPerfil from "../pages/editarPerfil/editarPerfil";
import Inicio from "../pages/inicio/inicio";
import EscolhaTipo from "../pages/escolha/escolha";
import CadastroImovel from "../pages/cadastroImovel/CadastroImovel";
import EsqueciSenha from "../pages/esqueciSenha/EsqueciSenha";
import RedefinirSenha from "../pages/redefinirSenha/RedefinirSenha";
import ListarImoveis from "../pages/listarImoveis/ListarImoveis";

const router = createBrowserRouter([
    { 
        path: "/",
        element: <EscolhaTipo /> 
    },
    { 
        path: "/escolha",
        element: <EscolhaTipo /> 
    },
    { 
        path: "/login",
        element: <Login /> 
    },
    { 
        path: "/cadastro",
        element: <Cadastro /> 
    },
    { 
        path: "/esqueci-senha",
        element: <EsqueciSenha /> 
    },
    { 
        path: "/redefinir-senha",
        element: <RedefinirSenha /> 
    },
    {
        element: <LayoutPrivado />,
        children: [
            {
                path: "dashboard",
                element: <Inicio isHome={true} />
            },
            {
                path: "inicio",
                element: <Inicio isHome={true} />
            },
            {
                path: "listar-imoveis",
                element: <ListarImoveis />
            },
            {
                path: "meus-imoveis",
                element: <Inicio isHome={false} />
            },
            {
                path: "perfil",
                element: <Perfil />
            },
            {
                path: "editarPerfil",
                element: <EditarPerfil />
            },
            {
                path: "cadastro-imovel",
                element: <CadastroImovel />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);

export default router;
