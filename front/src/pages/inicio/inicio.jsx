import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const user = {
  name: "Lucas Pereira de Sousa",
  role: "Locatário",
  email: "lucas@email.com",
  phone: "(88) 91234-5678",
  avatar: "https://via.placeholder.com/150",
  typeOfRental:
    "O que eu busco em um locatário é, acima de tudo, tranquilidade mútua. Espero alguém que trate o imóvel como um lar.",
  cpf: "000.123.456-89",
  sexo: "Masculino",
  profissao: "Doutor Ortopedista",
  nascimento: "21/10/1987",
  endereco: "Alameda Jose Quintino, N 109",
};

export default function Inicio() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h1 className="text-xl font-semibold text-gray-800">
              Olá, {user.name.split(" ")[0]}!
            </h1>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-100">

          <div className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-cyan-500 bg-white p-8 shadow-lg">

            {/* FOTO */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-28 w-28 rounded-full border-4 border-cyan-500 object-cover shadow-md"
              />
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.role}
              </h2>
            </div>

            {/* DADOS */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Nome</p>
                <p className="text-gray-700">{user.name}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Email</p>
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Telefone</p>
                <p className="text-gray-700">{user.phone}</p>
              </div>
            </div>

            {/* LOCAÇÃO */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-bold text-gray-900">
                Qual tipo de locação procuro?
              </h3>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {user.typeOfRental}
              </p>
            </div>

            {/* OUTROS DADOS */}
            <div className="mt-8 border-t pt-6 space-y-4">
              <h3 className="font-bold text-gray-900">Outros Dados</h3>

              <div>
                <p className="text-sm font-bold text-gray-900">CPF</p>
                <p className="text-gray-700">{user.cpf}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Sexo</p>
                <p className="text-gray-700">{user.sexo}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Profissão</p>
                <p className="text-gray-700">{user.profissao}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Data de Nascimento
                </p>
                <p className="text-gray-700">{user.nascimento}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Endereço</p>
                <p className="text-gray-700">{user.endereco}</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}