import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const user = {
  name: "Lucas Pereira de Sousa",
  role: "Locatário",
  email: "lucas.gmail.com",
  phone: "(88) 92867-2846",
  avatar: "https://via.placeholder.com/120",
  typeOfRental: "O que eu busco em um locatário é, acima de tudo, tranquilidade mútua. Espero alguém que trate o imóvel não apenas como um endereço temporário, mas como um lar, zelando pela conservação como se fosse seu.",
};

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
        <Sidebar />

        <main className="flex-1">

          {/* SEU HEADER ORIGINAL */}
          <header className="bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Olá, {user.name.split(" ")[0]}!
              </h1>
            </div>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-8">
            <div className="w-full rounded-2xl border-2 border-cyan-500 bg-white p-8 shadow-lg sm:p-12">
              
              <div className="flex flex-col items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-28 w-28 rounded-full border-4 border-cyan-500 object-cover shadow-md"
                />
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.role}
                </h2>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Nome</p>
                  <p className="mt-1 text-gray-700">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Email</p>
                  <p className="mt-1 text-gray-700">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Telefone</p>
                  <p className="mt-1 text-gray-700">{user.phone}</p>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-gray-900">
                  Qual tipo de locação procuro?
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {user.typeOfRental}
                </p>
              </div>

              <button
                onClick={() => navigate("/editarPerfil")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600"
              >
                Editar Perfil
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}