import React, { useState } from "react";

const initialForm = {
  nome: "",
  sobrenome: "",
  cpf: "",
  nascimento: "",
  sexo: "",
  profissao: "",
  senha: "",
  confirmSenha: "",
  email: "",
};

export default function Cadastro() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (form.senha && form.confirmSenha && form.senha !== form.confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // Aqui você pode enviar o formulário ou avançar para a próxima etapa
    console.log("Formulário válido", form);
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black ${
      errors[field]
        ? "bg-white border border-red-500 focus:border-red-500"
        : "bg-white border border-black focus:border-black"
    }`;

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

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-[950px] h-auto lg:min-h-[600px] rounded-[32px] bg-white/95 shadow-[0_40px_120px_rgba(0,0,0,0.18)]"
        >
          <div className="flex flex-col h-full p-4 md:p-6 lg:p-8">
            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1">
              {/* Coluna Esquerda */}
              <div className="flex flex-col">
                {/* Logo e Botões Login/Cadastro */}
                <div className="flex flex-col items-center mb-4 md:mb-6">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">LOGO</h1>

                  {/* Botões Login/Cadastro */}
                  <div className="flex bg-gray-200 rounded-lg p-1 gap-0">
                    <button type="button" className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-500 text-sm font-medium rounded-sm hover:bg-gray-300">
                      Login
                    </button>
                    <button type="button" className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-900 text-sm font-bold rounded-sm">
                      Cadastre-se
                    </button>
                  </div>
                </div>
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Bem vindo</h2>
                  <p className="text-gray-500 text-sm">Por favor, faça seu cadastro.</p>
                </div>

                {/* Inputs esquerda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(event) => handleChange("nome", event.target.value)}
                      placeholder="Primeiro nome"
                      className={inputClass("nome")}
                    />
                    {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sobrenome</label>
                    <input
                      type="text"
                      value={form.sobrenome}
                      onChange={(event) => handleChange("sobrenome", event.target.value)}
                      placeholder="Sobrenome"
                      className={inputClass("sobrenome")}
                    />
                    {errors.sobrenome && <p className="mt-1 text-xs text-red-500">{errors.sobrenome}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      value={form.cpf}
                      onChange={(event) => handleChange("cpf", event.target.value)}
                      placeholder="Digite apenas números"
                      className={inputClass("cpf")}
                    />
                    {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Data de nascimento</label>
                    <input
                      type="text"
                      value={form.nascimento}
                      onChange={(event) => handleChange("nascimento", event.target.value)}
                      placeholder="Digite apenas números"
                      className={inputClass("nascimento")}
                    />
                    {errors.nascimento && <p className="mt-1 text-xs text-red-500">{errors.nascimento}</p>}
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
                      value={form.sexo}
                      onChange={(event) => handleChange("sexo", event.target.value)}
                      className={inputClass("sexo")}
                    >
                      <option value="">Masculino/Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                    {errors.sexo && <p className="mt-1 text-xs text-red-500">{errors.sexo}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Profissão</label>
                    <input
                      type="text"
                      value={form.profissao}
                      onChange={(event) => handleChange("profissao", event.target.value)}
                      placeholder="Informe sua profissão"
                      className={inputClass("profissao")}
                    />
                    {errors.profissao && <p className="mt-1 text-xs text-red-500">{errors.profissao}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
                    <input
                      type="password"
                      value={form.senha}
                      onChange={(event) => handleChange("senha", event.target.value)}
                      placeholder="Senha"
                      className={inputClass("senha")}
                    />
                    {errors.senha && <p className="mt-1 text-xs text-red-500">{errors.senha}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirme a senha</label>
                    <input
                      type="password"
                      value={form.confirmSenha}
                      onChange={(event) => handleChange("confirmSenha", event.target.value)}
                      placeholder="Confirme senha"
                      className={inputClass("confirmSenha")}
                    />
                    {errors.confirmSenha && <p className="mt-1 text-xs text-red-500">{errors.confirmSenha}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      placeholder="usuario123@email.com"
                      className={inputClass("email")}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-white py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-cyan-600"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
