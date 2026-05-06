import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../../assets/imgs/bg.png";

export default function EscolhaTipo() {
  const navigate = useNavigate();

  function handleSelect(tipo) {
    // salva escolha
    localStorage.setItem("tipo_usuario", tipo);

    // redireciona
    navigate("/login"); // ou "/cadastro" se quiser
  }

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/90  p-8 rounded-2xl shadow-xl text-center">

        <h1 className="text-4xl font-bold mb-6">LOGO</h1>

        <h2 className="text-lg font-semibold mb-6">
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
  );
}

