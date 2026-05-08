import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../../assets/imgs/bg.png";
import locadorImg from "../../assets/imgs/locador.png";
import locatarioImg from "../../assets/imgs/locatario.png";

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
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center lg:justify-start px-4 md:px-8 lg:px-16">
        
        {/* CARD PRINCIPAL */}
        <div className="w-full max-w-[500px] rounded-[32px] bg-white/95 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          
          <h1 className="text-center text-4xl font-bold mb-10 text-gray-900 tracking-tight">
            LOGO
          </h1>

          <h2 className="text-center text-xl font-semibold mb-12 text-gray-800">
            Quem é você?
          </h2>

          <div className="flex flex-row items-center justify-center gap-10">

            {/* BOTÃO LOCADOR */}
            <button
              onClick={() => handleSelect("locador")}
              className="group flex flex-col items-center gap-4 transition-transform hover:scale-105"
            >
              <div className="w-[150px] h-[130px] rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition group-hover:shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-cyan-500 overflow-hidden shadow-inner">
                  <img src={locadorImg} alt="Locador" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-lg font-bold text-gray-700">
                Locador
              </span>
            </button>

            {/* BOTÃO LOCATÁRIO */}
            <button
              onClick={() => handleSelect("locatario")}
              className="group flex flex-col items-center gap-4 transition-transform hover:scale-105"
            >
              <div className="w-[150px] h-[130px] rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition group-hover:shadow-md">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-cyan-500 overflow-hidden shadow-inner">
                  <img src={locatarioImg} alt="Locatário" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-lg font-bold text-gray-700">
                Locatário
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
