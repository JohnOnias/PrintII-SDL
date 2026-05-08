import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getProfile } from "../../services/userService";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error("ERRO AO BUSCAR USER:", err);
        // Se falhar a busca online, tenta pegar do local
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser) {
          setUser(localUser);
        } else {
          navigate("/login");
        }
      }
    }

    loadUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full font-[Poppins] bg-white">
      
      {/* CONTEÚDO */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">

        {/* HEADER */}
        <header className="bg-white px-8 py-6 flex items-center gap-4">
          <h1 className="text-2xl font-light text-slate-800">
            Olá, {user.username}!
          </h1>
        </header>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 flex flex-col items-center justify-start pt-24 pb-16 px-4">

          {/* CARD PRINCIPAL */}
          <div className="relative w-full max-w-[520px] rounded-xl border border-gray-200 bg-white px-6 md:px-8 pb-8 pt-20 shadow-sm">
            
             {/* AVATAR OVERLAPPING */}
             <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[6px] border-[#176999] bg-white">
              <img
                src={user.avatar || UserPerfil}
                alt="avatar"
                className="h-[90px] w-[90px] rounded-full object-cover"
              />
            </div>

            {/* ROLE / TIPO DE USUÁRIO */}
            <div className="text-center mb-8">
               <h2 className="text-2xl font-semibold text-[#404040]/60 capitalize tracking-tight">
                 {user.tipo_de_usuario || "Locatário"}
               </h2>
            </div>

            {/* INFO BOX */}
            <div className="w-full bg-white border border-gray-100 shadow-[0px_1.5px_1.5px_rgba(0,0,0,0.10)] rounded-md p-5 space-y-3 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider">Nome</h3>
                  <p className="text-sm font-normal text-black mt-0.5">{user.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider">Email</h3>
                  <p className="text-sm font-normal text-black mt-0.5">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider">Telefone</h3>
                  <p className="text-xs font-normal text-[#222222]/90 mt-0.5">{user.telefone || "(88) 922667-2846"}</p>
                </div>
            </div>

            {/* DESCRIPTION BOX */}
            <div className="w-full bg-white border border-gray-100 shadow-[0px_1.5px_1.5px_rgba(0,0,0,0.10)] rounded-md p-5 mb-8">
                <h3 className="text-sm font-bold text-black mb-2">
                  Qual tipo de locação procuro?
                </h3>
                <p className="text-xs font-normal text-[#49454f]/80 leading-relaxed">
                  {user.locacao || "O que eu busco em um locatário é, acima de tudo, tranquilidade mútua. Espero alguém que trate o imóvel não apenas como um endereço temporário, mas como um lar, zelando pela conservação como se fosse seu."}
                </p>
            </div>

            {/* EDIT BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/editarPerfil")}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/50 px-5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Editor Perfil
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
