import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getUser, updateUser } from "../../services/userService";

export default function EditarPerfil() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefone: "",
    profissao: "",
    cpf: "",
    sexo: "",
    nascimento: "",
    endereco: "",
    locacao: "",
  });

  // ✅ CARREGA DADOS CORRETAMENTE (ASYNC)
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser();
        setForm(data);
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }

    loadUser();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ✅ SALVA NO BACKEND
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateUser(form);

      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar perfil");
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <Sidebar />

      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white px-8 py-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            Editar Perfil
          </h1>
        </header>

        {/* FORM */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md space-y-4"
          >

            {/* NOME */}
            <div>
              <label className="text-sm font-semibold">Nome</label>
              <input
                name="username"
                value={form.username || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* TELEFONE */}
            <div>
              <label className="text-sm font-semibold">Telefone</label>
              <input
                name="telefone"
                value={form.telefone || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* PROFISSÃO */}
            <div>
              <label className="text-sm font-semibold">Profissão</label>
              <input
                name="profissao"
                value={form.profissao || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="text-sm font-semibold">CPF</label>
              <input
                name="cpf"
                value={form.cpf || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* SEXO */}
            <div>
              <label className="text-sm font-semibold">Sexo</label>
              <input
                name="sexo"
                value={form.sexo || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* NASCIMENTO */}
            <div>
              <label className="text-sm font-semibold">Nascimento</label>
              <input
                type="date"
                name="nascimento"
                value={form.nascimento || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* ENDEREÇO */}
            <div>
              <label className="text-sm font-semibold">Endereço</label>
              <input
                name="endereco"
                value={form.endereco || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* DESCRIÇÃO LOCAÇÃO */}
            <div>
              <label className="text-sm font-semibold">
                Descrição de locação
              </label>

              <textarea
                name="locacao"
                value={form.locacao || ""}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 p-3 border rounded"
              />
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-3 rounded hover:bg-cyan-600"
            >
              Salvar Alterações
            </button>

          </form>

        </div>
      </main>
    </div>
  );
}