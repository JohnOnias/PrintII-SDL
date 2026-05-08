import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/userService";

const navItems = [
  { label: "Início", path: "/dashboard" },
  { label: "Perfil", path: "/perfil" },
  { label: "Sair", path: "logout" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleNav = (path) => {
    if (path === "logout") {
      logout();
    } else {
      navigate(path);
    }
  };

  return (
    <aside className="min-h-screen w-full max-w-[280px] bg-gradient-to-b from-cyan-600 via-sky-600 to-blue-700 text-white shadow-lg md:sticky md:top-0 md:self-start">
      <div className="hidden md:flex h-full flex-col px-6 py-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-100/90">Olá,</p>
            <h2 className="text-xl font-semibold">{user?.username || "Usuário"}</h2>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition hover:bg-white/10 ${
                  isActive ? "bg-white/15 text-white shadow-inner" : "text-cyan-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-4 text-sm text-cyan-50">
          <p className="font-semibold">Dica</p>
          <p className="mt-2 text-xs leading-5 text-cyan-100/90">
            Atualize seu perfil para receber propostas mais rápidas e ter mais credibilidade com locadores.
          </p>
        </div>
      </div>

      <div className="md:hidden bg-cyan-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Perfil</p>
            <p className="text-lg font-semibold">Locatário</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNav(item.path)}
              className="whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-white/20"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
