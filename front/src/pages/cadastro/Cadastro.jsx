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
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "confirmPassword" && !value.toString().trim()) {
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
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

  // 🔥 CAMPOS OBRIGATÓRIOS DO BACKEND
  idade: "25",
  rua: "Não informado",
  bairro: "Não informado",
  numero: 0,
  tipo_de_usuario: "locatario",
};

const result = await cadastroAuth(dataToSend);

// 🔥 SALVAR USUÁRIO LOCAL
localStorage.setItem("user", JSON.stringify(dataToSend));

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

      <div className="w-full max-w-[450px] bg-white/95 rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.18)] p-8 text-center">

        <h1 className="text-3xl font-bold mb-6">LOGO</h1>

        <h2 className="text-lg font-semibold mb-8">
          Quem é você?
        </h2>

        <div className="flex justify-center gap-6">

          {/* LOCADOR */}
          <button
            onClick={() => handleSelect("locador")}
            className="flex flex-col items-center bg-cyan-500 text-white p-6 rounded-xl hover:bg-cyan-600 transition"
          >
            <span className="text-4xl mb-2">🏠</span>
            <span className="font-semibold">Locador</span>
          </button>

          {/* LOCATÁRIO */}
          <button
            onClick={() => handleSelect("locatario")}
            className="flex flex-col items-center bg-cyan-500 text-white p-6 rounded-xl hover:bg-cyan-600 transition"
          >
            <span className="text-4xl mb-2">🔑</span>
            <span className="font-semibold">Locatário</span>
          </button>

        </div>

      </div>

    </div>
  </div>
);
}