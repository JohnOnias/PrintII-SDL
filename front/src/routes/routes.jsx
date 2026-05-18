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

const router = createBrowserRouter([
    { 
        path: "/",
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
        path: "/escolha",
        element: <EscolhaTipo /> 
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
        path: "/",
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
    }
]);

export default router;
