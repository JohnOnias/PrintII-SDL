import React, { useState, useCallback } from "react";

export default function FiltroImoveis({ onFilterChange, onAbrirFiltrosAvancados }) {
  const [pesquisa, setPesquisa] = useState("");

  const handlePesquisa = useCallback((e) => {
    const valor = e.target.value;
    setPesquisa(valor);
    onFilterChange({
      categoria: "",
      valorMinimo: "",
      valorMaximo: "",
      endereco: valor,
    });
  }, [onFilterChange]);

  return (
    <div className="mb-6">
      <div className="flex gap-3 items-center bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          value={pesquisa}
          onChange={handlePesquisa}
          placeholder="Pesquisar por localização..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAbrirFiltrosAvancados}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2.414l5.293 5.293a1 1 0 010 1.414l-5.293 5.293V17a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm10.707 9.293a1 1 0 00-1.414 0L9 12.586V15h3v-2.586l2.707-2.707z" clipRule="evenodd" />
          </svg>
          Filtrar
        </button>
      </div>
    </div>
  );
}