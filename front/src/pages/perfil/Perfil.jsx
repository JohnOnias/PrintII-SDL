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
    <div className="flex flex-col h-full w-full font-[Poppins]">
      
      {/* CONTEÚDO */}
      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* HEADER */}
        <header className="bg-white px-4 sm:px-6 md:px-8 py-5 shadow-sm">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Olá, {user.username}!
          </h1>
        </header>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-gray-100">

          {/* CARD */}
          <div className="w-full max-w-4xl rounded-2xl border-2 border-cyan-500 bg-white shadow-lg">

            {/* TOPO */}
            <div className="flex flex-col items-center px-6 py-8">

              <img
                src={user.avatar || "https://via.placeholder.com/120"}
                alt="avatar"
                className="h-28 w-28 rounded-full border-4 border-cyan-500 object-cover shadow-md"
              />

              <h2 className="mt-4 text-2xl font-semibold text-gray-800 capitalize">
                {user.tipo_de_usuario || "Perfil"}
              </h2>
            </div>

            {/* DADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-10 pb-8">

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Nome</p>
                  <p className="text-gray-700 break-words">
                    {user.username || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">Email</p>
                  <p className="text-gray-700 break-words">
                    {user.email || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">CPF</p>
                  <p className="text-gray-700">
                    {user.cpf || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Profissão
                  </p>
                  <p className="text-gray-700">
                    {user.profissao || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Sexo
                  </p>

                  <p className="text-gray-700">
                    {user.sexo || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Idade
                  </p>

                  <p className="text-gray-700">
                    {user.idade || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Cidade
                  </p>

                  <p className="text-gray-700">
                    {user.cidade || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Estado
                  </p>

                  <p className="text-gray-700">
                    {user.estado || "Não informado"}
                  </p>
                </div>

              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="px-6 md:px-10 pb-8">

              <div className="rounded-xl border bg-gray-50 p-5">

                <h3 className="font-bold text-gray-900 mb-3">
                  Descrição de locação
                </h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  {user.locacao ||
                    "Nenhuma descrição cadastrada."}
                </p>

              </div>

              {/* BOTÃO */}
              <button
                onClick={() => navigate("/editarPerfil")}
                className="mt-6 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                Editar Perfil
              </button>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
