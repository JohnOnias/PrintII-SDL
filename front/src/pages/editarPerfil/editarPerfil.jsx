import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function EditarPerfil() {
  const [form, setForm] = useState({
    nome: "Lucas Pereira de Sousa",
    email: "lucas@email.com",
    telefone: "(88) 91234-5678",
    locacao:
      "O que eu busco em um locatário é, acima de tudo, tranquilidade mútua.",
    cpf: "000.123.456-89",
    sexo: "Masculino",
    profissao: "Doutor Ortopedista",
    nascimento: "1987-10-21",
    endereco: "Alameda Jose Quintino, N 109",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

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
              Olá, {form.nome.split(" ")[0]}!
            </h1>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-100">

          <div className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-cyan-500 bg-white p-8 shadow-lg">

            {/* FOTO */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500">
                <img
                  src="https://via.placeholder.com/150"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <button className="px-5 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600">
                Mudar Foto
              </button>
            </div>

            {/* DADOS DO PERFIL */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Dados do Perfil
            </h2>

            <div className="bg-gray-50 border rounded p-5 mb-6 space-y-4">

              <div>
                <label className="text-sm font-semibold">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

            </div>

            {/* LOCAÇÃO */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Qual tipo de locação procuro?
            </h2>

            <div className="bg-gray-50 border rounded p-5 mb-6">
              <textarea
                name="locacao"
                value={form.locacao}
                onChange={handleChange}
                rows={5}
                className="w-full border rounded px-3 py-2 resize-none"
              />
            </div>

            {/* SENHA */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Senha de Acesso
            </h2>

            <div className="bg-gray-50 border rounded p-5 mb-6">
              <button className="flex items-center gap-2 text-cyan-600 font-semibold hover:underline">
                Alterar Senha
              </button>
            </div>

            {/* OUTROS DADOS */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Outros Dados
            </h2>

            <div className="bg-gray-50 border rounded p-5 mb-6 space-y-4">

              <div>
                <label className="text-sm font-semibold">CPF</label>
                <input name="cpf" value={form.cpf} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Sexo</label>
                <input name="sexo" value={form.sexo} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Profissão</label>
                <input name="profissao" value={form.profissao} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Data de Nascimento</label>
                <input type="date" name="nascimento" value={form.nascimento} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

              <div>
                <label className="text-sm font-semibold">Endereço</label>
                <input name="endereco" value={form.endereco} onChange={handleChange} className="w-full h-12 mt-1 px-3 border rounded" />
              </div>

            </div>

            {/* BOTÃO */}
            <button className="px-8 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600">
              Salvar Alterações
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}