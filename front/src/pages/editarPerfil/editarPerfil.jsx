import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getUser, updateUser } from "../../services/userService";

export default function EditarPerfil() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    telefone: "",
    locacao: "",
    password: "",
    newPassword: "",
    cpf: "",
    sexo: "",
    profissao: "",
    nascimento: "",
    endereco: "",
  });

  // 🔥 CARREGA USER
  useEffect(() => {

    const user = getUser();

    if (user) {
      setForm(user);
    }

  }, []);

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 🔥 Chama o serviço que agora integra com o backend
      const updatedUser = await updateUser(form);

      // 🔥 ATUALIZA STATE
      setForm(updatedUser);

      console.log("USER SALVO NO BACKEND:", updatedUser);

      alert("Perfil atualizado com sucesso!");

    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar perfil: " + err.message);
    }
  }

  return (
    <div className="flex flex-col h-full w-full">

      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* HEADER */}
        <header className="bg-white px-8 py-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            Editar Perfil
          </h1>
        </header>

        {/* FORM */}
        <div className="p-8">

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md space-y-6 max-w-5xl mx-auto"
          >

            {/* DADOS PERFIL */}
            <div>

              <h2 className="text-lg font-bold mb-4">
                Dados do perfil
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm font-semibold">
                    Nome
                  </label>

                  <input
                    name="username"
                    value={form.username || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Email
                  </label>

                  <input
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Telefone
                  </label>

                  <input
                    name="telefone"
                    value={form.telefone || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Que tipo de locação procuro?
                  </label>

                  <textarea
                    name="locacao"
                    value={form.locacao || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

              </div>
            </div>

            {/* SENHA */}
            <div>

              <h2 className="text-lg font-bold mb-4">
                Senha de acesso
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm font-semibold">
                    Senha
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Alterar senha
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

              </div>
            </div>

            {/* OUTROS DADOS */}
            <div>

              <h2 className="text-lg font-bold mb-4">
                Outros dados
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm font-semibold">
                    CPF
                  </label>

                  <input
                    name="cpf"
                    value={form.cpf || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Sexo
                  </label>

                  <input
                    name="sexo"
                    value={form.sexo || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Profissão
                  </label>

                  <input
                    name="profissao"
                    value={form.profissao || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Data de nascimento
                  </label>

                  <input
                    type="date"
                    name="nascimento"
                    value={form.nascimento || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Endereço
                  </label>

                  <input
                    name="endereco"
                    value={form.endereco || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded"
                  />
                </div>

              </div>
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