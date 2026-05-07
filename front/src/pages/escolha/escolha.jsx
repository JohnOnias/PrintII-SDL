import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../../assets/imgs/bg.png";

export default function EscolhaTipo() {
  const navigate = useNavigate();

  function handleSelect(tipo) {
    localStorage.setItem("tipo_usuario", tipo);

    navigate("/login");
  }

  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* POSICIONAMENTO RESPONSIVO */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center lg:justify-start px-4 md:px-8 lg:px-16">

        {/* CARD */}
        <div className="w-full max-w-[520px] rounded-[32px] bg-white/95 p-8 md:p-10 lg:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">

          {/* LOGO */}
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-10">
            LOGO
          </h1>

          {/* TEXTO */}
          <h2 className="text-center text-xl md:text-2xl font-semibold mb-10">
            Quem é você?
          </h2>

          {/* BOTÕES */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

            {/* LOCADOR */}
            <button
              onClick={() => handleSelect("locador")}
              className="w-full sm:w-[180px] h-[180px] flex flex-col items-center justify-center rounded-2xl bg-cyan-500 text-white transition hover:bg-cyan-600 shadow-lg"
            >
              <span className="text-6xl mb-4">🏠</span>

              <span className="text-lg font-semibold">
                Locador
              </span>
            </button>

            {/* LOCATÁRIO */}
            <button
              onClick={() => handleSelect("locatario")}
              className="w-full sm:w-[180px] h-[180px] flex flex-col items-center justify-center rounded-2xl bg-cyan-500 text-white transition hover:bg-cyan-600 shadow-lg"
            >
              <span className="text-6xl mb-4">🔑</span>

              <span className="text-lg font-semibold">
                Locatário
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}