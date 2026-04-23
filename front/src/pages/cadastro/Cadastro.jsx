import React, { useState } from "react";

export default function Cadastro() {
  const [sexo, setSexo] = useState("");

  return (
    <div
      className="h-screen w-full overflow-y-auto bg-[#07A9E9] text-gray-900"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-start md:items-center justify-center lg:justify-start px-4 md:px-6 lg:px-10">
        <div className="absolute right-0 top-0 hidden lg:block h-full w-1/2 overflow-hidden">
          <img
            src="/casa.jpg"
            alt="Fachada de uma casa"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#07A9E9]/95 via-[#07A9E9]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-[950px] h-auto lg:min-h-[600px] rounded-[32px] bg-white/95 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col h-full p-4 md:p-6 lg:p-8">
            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1">
              {/* Coluna Esquerda */}
              <div className="flex flex-col">
                {/* Logo e Botões Login/Cadastro */}
                <div className="flex flex-col items-center mb-4 md:mb-6">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">LOGO</h1>
                  
                  {/* Botões Login/Cadastro */}
<<<<<<< HEAD
                  <div className="w-[30vh] h-[3vw] flex bg-gray-200 rounded-lg">
                    <button className="ml-[1vw] w-[10vh] text-gray-500 text-sm font-medium rounded-sm hover:bg-gray-300">
                      Login
                    </button>
                  <div className="flex bg-gray-200 rounded-lg p-1 gap-0">
                    <button className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-500 text-sm font-medium rounded-sm hover:bg-gray-300">
                      Login
                    </button>
                    <button className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-900 text-sm font-bold rounded-sm">mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Bem vindo</h2>
                  <p className="text-gray-500 text-sm">Por favor, faça seu cadastro.</p>
                </div>

                {/* Inputs esquerda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      placeholder="Primeiro nome"
<<<<<<< HEAD
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
>>>>>>> 66710a1 (responsividade)
                    />
                  </div>
                  <div>
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"Name="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="Digite apenas números"
<<<<<<< HEAD
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
>>>>>>> 66710a1 (responsividade)
                    />
                  </div>
                  <div>
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data de nascimento</label>
                    <input
                      type="text"
                      placeholder="Digite apenas números"
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"pt-2"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sexo</label>
                    <select
                      value={sexo}
                      onChange={(event) => setSexo(event.target.value)}
<<<<<<< HEAD
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 outline-none focus:border-black"
>>>>>>> 66710a1 (responsividade)
                    >
                      <option value="">Masculino/Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                  <div>
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
>>>>>>> 66710a1 (responsividade)
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
                    <input
                      type="password"
                      placeholder="Senha"
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirme a senha</label>
                    <input
                      type="password"
                      placeholder="Confirme senha"
<<<<<<< HEAD
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
=======
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"
                      className="w-full px-4 py-2.5 bg-white border border-black rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black"e="w-full bg-cyan-500 text-white py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-cyan-600">
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
