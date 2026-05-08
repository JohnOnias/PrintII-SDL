import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/userService";

export default function Inicio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getProfile();
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
    <div className="flex flex-col h-full w-full bg-gray-100">

      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* HEADER */}
        <header className="bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Olá, {user.username}!
            </h1>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 px-8 py-6">

          <div className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-cyan-500 bg-white p-8 shadow-lg">

            {/* FOTO */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.username}
                className="h-28 w-28 rounded-full border-4 border-cyan-500 object-cover shadow-md"
              />

              <h2 className="text-2xl font-semibold text-gray-800">
                {user.tipo_de_usuario || "Usuário"}
              </h2>
            </div>

            {/* DADOS */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Nome</p>
                <p className="text-gray-700">{user.username}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Email</p>
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">CPF</p>
                <p className="text-gray-700">{user.cpf}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Profissão</p>
                <p className="text-gray-700">{user.profissao}</p>
              </div>
            </div>

            {/* LOCAÇÃO */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-gray-900">
                Qual tipo de locação procuro?
              </h3>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {user.descricao || "Não informado"}
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}