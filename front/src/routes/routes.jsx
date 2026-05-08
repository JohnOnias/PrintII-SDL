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
        path: "/",
        element: <LayoutPrivado />,
        children: [
            {
                path: "dashboard",
                element: <Inicio />
            },
            {
                path: "inicio",
                element: <Inicio />
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
