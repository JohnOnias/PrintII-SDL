import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getUser } from "../../services/userService";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        console.error("ERRO AO BUSCAR USER:", err);
      }
    }

    loadUser();
  }, []);

  if (!user) {
    return <div className="p-10">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
        <Sidebar />

        <main className="flex-1">

          {/* HEADER (igual seu design) */}
          <header className="bg-white px-8 py-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
              Olá, {user.username}!
            </h1>
          </header>

          {/* CONTEÚDO */}
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-8">

            <div className="w-full rounded-2xl border-2 border-cyan-500 bg-white p-8 shadow-lg sm:p-12">

              {/* FOTO */}
              <div className="flex flex-col items-center gap-4">
                <img
                  src={user.avatar || "https://via.placeholder.com/120"}
                  className="h-28 w-28 rounded-full border-4 border-cyan-500 object-cover shadow-md"
                />

                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.tipo_de_usuario || "Perfil"}
                </h2>
              </div>

              {/* DADOS */}
              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-sm font-bold">Nome</p>
                  <p>{user.username}</p>
                </div>

                <div>
                  <p className="text-sm font-bold">Email</p>
                  <p>{user.email}</p>
                </div>

                <div>
                  <p className="text-sm font-bold">CPF</p>
                  <p>{user.cpf}</p>
                </div>

                <div>
                  <p className="text-sm font-bold">Profissão</p>
                  <p>{user.profissao}</p>
                </div>
              </div>

              {/* BOTÃO (SEM MEXER NO DESIGN) */}
              <button
                onClick={() => navigate("/editarPerfil")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600"
              >
                Editar Perfil
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}