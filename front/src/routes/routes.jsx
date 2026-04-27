import { createBrowserRouter } from "react-router-dom";

import LayoutPrivado from "../components/layout/LayoutPrivado";

// pages
import Login from "../pages/login/Login"; 
import Cadastro from "../pages/cadastro/Cadastro";
import Perfil from "../pages/perfil/Perfil";

const router = createBrowserRouter([
    { 
        path: "/login",
        element: <Login /> 
    },
    { 
        path: "/cadastro",
        element: <Cadastro /> 
    },
  {
    path: "/",
    element: <LayoutPrivado />,
    children: [
        {
            path: "perfil",
            element: <Perfil/>
        }
    ]
}
]);

export default router;