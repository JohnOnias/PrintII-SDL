import React, { useState } from "react";

export default function ModalFiltros({ isOpen, onClose, onAplicar }) {
  const [filtros, setFiltros] = useState({
    valorMinimo: "",
    valorMaximo: "",
    categorias: [],
    tipos: [],
    garagem: false,
    suite: false,
    quartos: 0,
    areaMin: "",
  });

  const toggleCategoria = (cat) => {
    setFiltros((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter((c) => c !== cat)
        : [...prev.categorias, cat],
    }));
  };

  const toggleTipo = (tipo) => {
    setFiltros((prev) => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter((t) => t !== tipo)
        : [...prev.tipos, tipo],
    }));
  };

  const handleQuartosChange = (delta) => {
    setFiltros((prev) => ({
      ...prev,
      quartos: Math.max(0, prev.quartos + delta),
    }));
  };

  const handleAplicar = async () => {
    const filtrosParaEnviar = {};

    if (filtros.categorias.length > 0) {
      filtrosParaEnviar.categoria = filtros.categorias.join(",");
    }
    if (filtros.tipos.length > 0) {
      filtrosParaEnviar.tipo = filtros.tipos.join(",");
    }
    if (filtros.valorMinimo) {
      filtrosParaEnviar.valor_min = parseFloat(filtros.valorMinimo);
    }
    if (filtros.valorMaximo) {
      filtrosParaEnviar.valor_max = parseFloat(filtros.valorMaximo);
    }
    if (filtros.garagem) {
      filtrosParaEnviar.garagem = true;
    }
    if (filtros.suite) {
      filtrosParaEnviar.suite = true;
    }
    if (filtros.quartos > 0) {
      filtrosParaEnviar.quartos = filtros.quartos;
    }
    if (filtros.areaMin) {
      filtrosParaEnviar.area_min = parseInt(filtros.areaMin);
    }

    await onAplicar(filtrosParaEnviar);
    onClose();
  };

  const handleLimpar = async () => {
    setFiltros({
      valorMinimo: "",
      valorMaximo: "",
      categorias: [],
      tipos: [],
      garagem: false,
      suite: false,
      quartos: 0,
      areaMin: "",
    });
    await onAplicar({});
    onClose();
  };

  if (!isOpen) return null;

  const categoriasOptions = [
    { value: "residencial", label: "Residência" },
    { value: "comercial", label: "Comercial" },
  ];

  const tiposOptions = [
    { value: "casa", label: "Casa" },
    { value: "apartamento", label: "Apartamento" },
    { value: "quarto", label: "Quarto" },
    { value: "terreno", label: "Terreno" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 font-[Poppins]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Filtros</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">

          {/* Preço */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Preço</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Mínimo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filtros.valorMinimo}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, valorMinimo: e.target.value }))
                    }
                    placeholder="0,00"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-transparent transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Máximo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filtros.valorMaximo}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, valorMaximo: e.target.value }))
                    }
                    placeholder="0,00"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-transparent transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Área Útil */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Área Mínima (m²)</h3>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={filtros.areaMin}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, areaMin: e.target.value }))
                }
                placeholder="Ex: 50"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-transparent transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Categoria */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {categoriasOptions.map((cat) => {
                const isSelected = filtros.categorias.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategoria(cat.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                      isSelected
                        ? "bg-[#219EBC] text-white border-[#219EBC] shadow-sm shadow-[#219EBC]/25"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`flex items-center justify-center w-4.5 h-4.5 rounded ${isSelected ? "text-white" : "text-gray-300"}`}>
                      {isSelected ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
                        </svg>
                      )}
                    </span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Tipo de Imóvel */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Tipo de Imóvel</h3>
            <div className="flex flex-wrap gap-2">
              {tiposOptions.map((tipo) => {
                const isSelected = filtros.tipos.includes(tipo.value);
                return (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => toggleTipo(tipo.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                      isSelected
                        ? "bg-[#219EBC] text-white border-[#219EBC] shadow-sm shadow-[#219EBC]/25"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`flex items-center justify-center w-4.5 h-4.5 rounded ${isSelected ? "text-white" : "text-gray-300"}`}>
                      {isSelected ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
                        </svg>
                      )}
                    </span>
                    {tipo.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Tipologia do Imóvel */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Tipologia do Imóvel</h3>
            <div className="flex flex-wrap gap-2">
              {/* Garagem */}
              <button
                type="button"
                onClick={() => setFiltros((prev) => ({ ...prev, garagem: !prev.garagem }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                  filtros.garagem
                    ? "bg-[#219EBC] text-white border-[#219EBC] shadow-sm shadow-[#219EBC]/25"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className={`flex items-center justify-center w-4.5 h-4.5 rounded ${filtros.garagem ? "text-white" : "text-gray-300"}`}>
                  {filtros.garagem ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
                    </svg>
                  )}
                </span>
                Garagem
              </button>

              {/* Suíte */}
              <button
                type="button"
                onClick={() => setFiltros((prev) => ({ ...prev, suite: !prev.suite }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                  filtros.suite
                    ? "bg-[#219EBC] text-white border-[#219EBC] shadow-sm shadow-[#219EBC]/25"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className={`flex items-center justify-center w-4.5 h-4.5 rounded ${filtros.suite ? "text-white" : "text-gray-300"}`}>
                  {filtros.suite ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
                    </svg>
                  )}
                </span>
                Suíte
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Nº de Quartos */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Nº de Quartos</h3>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleQuartosChange(-1)}
                disabled={filtros.quartos <= 0}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xl font-bold text-slate-800 min-w-[40px] text-center tabular-nums">
                {filtros.quartos}
              </span>
              <button
                type="button"
                onClick={() => handleQuartosChange(1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-4 flex gap-3">
          <button
            onClick={handleLimpar}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
          >
            Limpar
          </button>
          <button
            onClick={handleAplicar}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#219EBC] rounded-xl hover:bg-[#1a86a1] transition shadow-sm shadow-[#219EBC]/25"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
