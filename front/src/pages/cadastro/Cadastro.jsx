import React, { useState } from "react";

export default function Cadastro() {
  const [open, setOpen] = useState(false);
  const [sexo, setSexo] = useState("");

  const options = ["Masculino", "Feminino"];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-red-200 p-2">
        <h1>LOGO</h1>
      </div>

      <h2>Login</h2>
      <h2>Cadastre-se</h2>

      <h3>Bem-vindo</h3>
      <p>Por favor, faça seu cadastro.</p>

      {/* Inputs */}
      <label className="flex flex-col">
        Nome:
        <input className="bg-gray-100 p-2 rounded" />
      </label>

      <label className="flex flex-col">
        Sobrenome:
        <input className="bg-gray-100 p-2 rounded" />
      </label>

      <label className="flex flex-col">
        CPF:
        <input className="bg-gray-100 p-2 rounded" />
      </label>

      <label className="flex flex-col">
        Data de Nascimento:
        <input type="date" className="bg-gray-100 p-2 rounded" />
      </label>

      {/* SELECT CUSTOMIZADO */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">Sexo</span>

        <div
          onClick={() => setOpen(!open)}
          className="bg-gray-100 p-3 rounded cursor-pointer flex justify-between"
        >
          <span className="text-gray-600">
            {sexo || "Masculino/feminino"}
          </span>
          <span>▼</span>
        </div>

        {open && (
          <div className="mt-1 bg-white border rounded shadow">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setSexo(opt);
                  setOpen(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}