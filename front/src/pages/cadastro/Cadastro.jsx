import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../../assets/imgs/bg.png";
import { cadastroAuth } from "../../services/authService";

const initialForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  cpf: "",
  sexo: "",
  profissao: "",
};

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "confirmPassword" && !value.toString().trim()) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (form.cpf && form.cpf.length !== 11) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...rest } = form;

      const dataToSend = {
        ...rest,

        idade: "25",
        rua: "Não informado",
        bairro: "Não informado",
        numero: 0,

        // 🔥 tipo salvo na tela escolha
        tipo_de_usuario:
          localStorage.getItem("tipo_usuario") || "locatario",
      };

      const result = await cadastroAuth(dataToSend);

      // 🔥 salva usuário local
const userData = {
  ...dataToSend,
};

const oldUser =
  JSON.parse(localStorage.getItem("user")) || {};

const updatedUser = {
  ...oldUser,
  ...dataToSend,
};

localStorage.setItem(
  "user",
  JSON.stringify(updatedUser)
);

      console.log("Cadastro realizado com sucesso", result);

      alert("Cadastro realizado com sucesso!");

      localStorage.setItem("access_token", result.access);
      localStorage.setItem("refresh_token", result.refresh);

      navigate("/dashboard");

      setForm(initialForm);

    } catch (error) {
      console.error("Erro no cadastro", error);

      alert("Erro no cadastro: " + error.message);

    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-black ${
      errors[field]
        ? "bg-white border border-red-500 focus:border-red-500"
        : "bg-white border border-black focus:border-black"
    }`;

  return (
    <div
      className="h-screen w-full overflow-y-auto text-gray-900"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-start md:items-center justify-center lg:justify-start px-4 md:px-6 lg:px-10">

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-[950px] h-auto lg:min-h-[600px] rounded-[32px] bg-white/95 shadow-[0_40px_120px_rgba(0,0,0,0.18)]"
        >
          <div className="flex flex-col h-full p-4 md:p-6 lg:p-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 flex-1">

              {/* ESQUERDA */}
              <div className="flex flex-col">

                <div className="flex flex-col items-center mb-4 md:mb-6">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">
                    LOGO
                  </h1>

                  <div className="flex bg-gray-200 rounded-lg p-1 gap-0">

                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-500 text-sm font-medium rounded-sm hover:bg-gray-300"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      className="px-4 md:px-6 lg:px-12 py-2.5 text-gray-900 text-sm font-bold rounded-sm"
                    >
                      Cadastre-se
                    </button>

                  </div>
                </div>

                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    Bem vindo
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Por favor, faça seu cadastro.
                  </p>
                </div>

                <div className="space-y-4">

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome de Usuário
                    </label>

                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) =>
                        handleChange("username", e.target.value)
                      }
                      placeholder="Nome de usuário"
                      className={inputClass("username")}
                    />

                    {errors.username && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        handleChange("email", e.target.value)
                      }
                      placeholder="seu@email.com"
                      className={inputClass("email")}
                    />

                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CPF
                    </label>

                    <input
                      type="text"
                      value={form.cpf}
                      onChange={(e) =>
                        handleChange("cpf", e.target.value)
                      }
                      placeholder="11 dígitos"
                      className={inputClass("cpf")}
                    />

                    {errors.cpf && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.cpf}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* DIREITA */}
              <div className="flex flex-col justify-between">

                <div className="pt-2"></div>

                <div className="space-y-4">

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Sexo
                    </label>

                    <select
                      value={form.sexo}
                      onChange={(e) =>
                        handleChange("sexo", e.target.value)
                      }
                      className={inputClass("sexo")}
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Profissão
                    </label>

                    <input
                      type="text"
                      value={form.profissao}
                      onChange={(e) =>
                        handleChange("profissao", e.target.value)
                      }
                      placeholder="Sua profissão"
                      className={inputClass("profissao")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Senha
                    </label>

                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        handleChange("password", e.target.value)
                      }
                      placeholder="Senha"
                      className={inputClass("password")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirme a senha
                    </label>

                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handleChange(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Confirme sua senha"
                      className={inputClass("confirmPassword")}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 text-white py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-cyan-600 disabled:bg-gray-400"
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}