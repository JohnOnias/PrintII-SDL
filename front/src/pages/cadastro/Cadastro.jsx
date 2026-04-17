import React, { useState } from "react";

export default function Cadastro() {
  const [sexo, setSexo] = useState("");

  return (
    <div
      className="h-screen w-full -ml-50 overflow-hidden bg-[#07A9E9] text-gray-900"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center justify-start overflow-hidden px-6 lg:px-10">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 overflow-hidden lg:block">
          <img
            src="/casa.jpg"
            alt="Fachada de uma casa"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#07A9E9]/95 via-[#07A9E9]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 w-[95vh] h-[35vw] rounded-[32px] bg-white/95 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col h-full p-8">
            {/* Grid Principal */}
            <div className="grid grid-cols-2 gap-8 flex-1">
              {/* Coluna Esquerda */}
              <div className="flex flex-col">
                {/* Logo e Botões Login/Cadastro */}
                <div className="flex flex-col items-center mb-6">
                  <h1 className="text-5xl font-bold mb-6">LOGO</h1>
                  
                  {/* Botões Login/Cadastro */}
                  <div className="w-[30vh] h-[3vw] flex bg-gray-200 rounded-lg">
                    <button className="ml-[1vw] w-[10vh] text-gray-500 text-sm font-medium rounded-sm hover:bg-gray-300">
                      Login
                    </button>
                    <button className="ml-auto mr-[2vw] w-[11vh] text-gray-900 text-sm font-bold rounded-sm hover:bg-gray-300">
                      Cadastre-se
                    </button>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Bem vindo</h2>
                  <p className="text-gray-500 text-sm">Por favor, faça seu cadastro.</p>
                </div>

                {/* Inputs esquerda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      placeholder="Primeiro nome"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sobrenome</label>
                    <input
                      type="text"
                      placeholder="Sobrenome"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="Digite apenas números"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data de nascimento</label>
                    <input
                      type="text"
                      placeholder="Digite apenas números"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="flex flex-col justify-between">
                <div className="pt-2"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sexo</label>
                    <select
                      value={sexo}
                      onChange={(event) => setSexo(event.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    >
                      <option value="">Masculino/Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Profissão</label>
                    <input
                      type="text"
                      placeholder="Informe sua profissão"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
                    <input
                      type="password"
                      placeholder="Senha"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirme a senha</label>
                    <input
                      type="password"
                      placeholder="Confirme senha"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="usuario123@email.com"
                      className="w-full px-4 py-2.5 bg-transparent rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-300 focus:border-gray-500"
                    />
                  </div>
                </div>
                <button className="w-full bg-cyan-500 text-white py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-cyan-600 -translate-y-3">
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
