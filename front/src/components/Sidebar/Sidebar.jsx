import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/userService";
import CadastroImovel from "../../pages/cadastroImovel/CadastroImovel";

// Icons
import IconInicio from "../../assets/imgs/inicio.png";
import IconImoveis from "../../assets/imgs/imoveis.png";
import IconPerfil from "../../assets/imgs/perfil.png";
import IconLogout from "../../assets/imgs/logout.png";
import UserPerfil from "../../assets/imgs/UserPerfil.png";
import IconLocador from "../../assets/imgs/locador.png";
import IconLocatario from "../../assets/imgs/locatario.png";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const isLocador = user?.tipo_de_usuario === "locador";

  const isItemActive = (path) => {
    if (path === "/favoritos") {
      return location.pathname === "/listar-imoveis" && location.state?.fromFavorites;
    }
    return location.pathname === path;
  };

  const avatarUrl = user?.foto_perfil 
    ? (user.foto_perfil.startsWith('http') ? user.foto_perfil : `${API_BASE_URL}${user.foto_perfil}`)
    : UserPerfil;

    // Definindo os itens de navegação com base no tipo de usuário
  const navItems = [
    {
      label: "Inicio",
      path: isLocador ? '/dashboard' : '/listar-imoveis',
      icon: IconInicio
    }
  ];
  
  if (isLocador) {
    navItems.push({ label: "Meus Imóveis", path: "/meus-imoveis", icon: IconImoveis });
  } else {
    // Para Locatário, adicionamos Favoritos (usando ícone de imóveis como fallback se não houver um específico)
    navItems.push({ label: "Favoritos", path: "/favoritos", icon: IconImoveis });
  }

  navItems.push(
    { label: "Perfil", path: "/perfil", icon: IconPerfil },
    { label: "Sair", path: "logout", icon: IconLogout }
  );

  const handleNav = (path) => {
    if (path === "logout") {
      logout();
    } else if (path === "modal_imovel") {
      setIsModalOpen(true);
    } else if (path === "/favoritos") {
      navigate("/listar-imoveis", { state: { showFavorites: true, fromFavorites: true } });
      onClose();
    } else if (path !== "#") {
      navigate(path);
      onClose();
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-[20vw] min-w-[20vw] bg-[#219EBC] text-white flex-col font-[Poppins] overflow-hidden">
        
        {/* USER INFO AT TOP */}
        <div className="px-5 py-8 flex items-center gap-3">
          <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] border-[#091A64] bg-white overflow-hidden shadow-sm">
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold leading-tight">{user?.username || "Lucas"}</h2>
            <div className="flex items-center gap-1.5 opacity-70">
              <img 
                src={isLocador ? IconLocador : IconLocatario} 
                alt="role icon" 
                className="h-4 w-4 rounded-full object-cover" 
              />
              <p className="text-sm font-semibold capitalize">{user?.tipo_de_usuario || "Locatário"}</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex-1 px-0 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item, index) => {
              const isActive = isItemActive(item.path);
              
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
                    {item.icon && (
                      <img src={item.icon} alt={item.label} className="h-6 w-6 object-contain" />
                    )}
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

      {/* Mobile/Tablet sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 h-screen bg-[#219EBC] text-white flex flex-col font-[Poppins] overflow-hidden transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-[75vw] max-w-[300px]`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="text-sm font-medium text-white/50">Menu</span>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1" aria-label="Fechar menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* USER INFO AT TOP */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-[#091A64] bg-white overflow-hidden shadow-sm">
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight">{user?.username || "Lucas"}</h2>
            <div className="flex items-center gap-1.5 opacity-70">
              <img 
                src={isLocador ? IconLocador : IconLocatario} 
                alt="role icon" 
                className="h-4 w-4 rounded-full object-cover" 
              />
              <p className="text-sm font-semibold capitalize">{user?.tipo_de_usuario || "Locatário"}</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = isItemActive(item.path);
              if (item.isDivider) {
                return (
                  <li key={index} className="flex items-center gap-4 px-5 py-2">
                    <span className="text-base font-medium opacity-50">{item.label}</span>
                  </li>
                );
              }
              return (
                <li key={index}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className={`flex w-[90%] items-center gap-4 rounded-r-[30px] py-2.5 pl-5 text-left transition-all ${
                      isActive 
                        ? "bg-[#091A64]/40 text-white shadow-md" 
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon && (
                      <img src={item.icon} alt={item.label} className="h-5 w-5 object-contain" />
                    )}
                    <span className="text-base font-medium tracking-tight">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* MODAL DE CADASTRO DE IMÓVEL (O componente já é o modal) */}
      <CadastroImovel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
