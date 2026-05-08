import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/userService";
import CadastroImovel from "../../pages/cadastroImovel/CadastroImovel";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLocador = user?.tipo_de_usuario === "locador";

  const navItems = [
    { label: "Inicio", path: "/dashboard" },
  ];

  if (isLocador) {
    // Para Locador, o botão Inicio vira Meus Imóveis ou adicionamos logo abaixo conforme protótipo
    navItems.push({ label: "Meus Imóveis", path: "/dashboard" });
  } else {
    // Para Locatário, adicionamos Favoritos
    navItems.push({ label: "Favoritos", path: "/favoritos" });
  }

  navItems.push(
    { label: "Perfil", path: "/perfil" },
    { label: "Sair", path: "logout" }
  );

  const handleNav = (path) => {
    if (path === "logout") {
      logout();
    } else if (path === "modal_imovel") {
      setIsModalOpen(true);
    } else if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <>
      <aside className="h-screen w-[20vw] min-w-[20vw] bg-[#219EBC] text-white flex flex-col font-[Poppins] overflow-hidden">
        
        {/* USER INFO AT TOP */}
        <div className="px-5 py-8 flex items-center gap-3">
          <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] border-[#091A64] bg-white overflow-hidden shadow-sm">
            <img
              src={user?.avatar || "https://placehold.co/60x60"}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold leading-tight">{user?.username || "Lucas"}</h2>
            <p className="text-base font-semibold opacity-60 capitalize">{user?.tipo_de_usuario || "Locatário"}</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex-1 px-0 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              
              if (item.isDivider) {
                 return (
                  <li key={index} className="flex items-center gap-4 px-6 py-2">
                    <span className="text-lg font-medium opacity-50">{item.label}</span>
                  </li>
                 );
              }

              return (
                <li key={index}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className={`flex w-[90%] items-center gap-4 rounded-r-[30px] py-2.5 pl-6 text-left transition-all ${
                      isActive 
                        ? "bg-[#091A64]/40 text-white shadow-md" 
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg font-medium tracking-tight">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

      </aside>

      {/* MODAL DE CADASTRO DE IMÓVEL (O componente já é o modal) */}
      <CadastroImovel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
