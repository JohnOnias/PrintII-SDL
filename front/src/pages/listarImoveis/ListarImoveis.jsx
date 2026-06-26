import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getImoveis } from "../../services/imovelService";
import { getProfile, getUser } from "../../services/userService";
import DetalhesImovel from "./DetalhesImovel";

export default function ListarImoveis() {
  const location = useLocation();
  const [imoveis, setImoveis] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const filteredImoveis = useMemo(() => {
    let result = imoveis;
    if (showFavorites) {
      const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      result = result.filter((i) => favIds.includes(i.id));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((i) => (i.endereco || "").toLowerCase().includes(term));
    }
    const minVal = parseFloat(priceRange.min);
    const maxVal = parseFloat(priceRange.max);
    if (!isNaN(minVal)) result = result.filter((i) => parseFloat(i.valor) >= minVal);
    if (!isNaN(maxVal)) result = result.filter((i) => parseFloat(i.valor) <= maxVal);
    return result;
  }, [imoveis, searchTerm, showFavorites, priceRange]);

  useEffect(() => {
    setShowFavorites(!!location.state?.showFavorites);
    if (location.state?.fromFavorites) {
      setSelectedImovel(null);
    }
  }, [location.state?.showFavorites, location.state?.fromFavorites]);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (err) {
        const localUser = getUser();
        if (localUser) setUser(localUser);
      }
      try {
        const data = await getImoveis();
        setImoveis(data);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const parseEndereco = (endereco) => {
    if (!endereco) return { rua: "", cidade: "" };
    const regex = /^(.*),\s*(.*?)\s*-\s*(.*?),\s*CEP:\s*(.*?)\s*\((.*?)\)$/;
    const match = endereco.match(regex);
    if (match) {
      return {
        rua: match[1].trim(),
        cidade: `${match[2].trim()} - ${match[3].trim()}`,
      };
    }
    const parts = endereco.split(",").map((s) => s.trim());
    return { rua: parts[0] || endereco, cidade: parts[1] || "" };
  };

  const getImageUrl = (imovel) => {
    if (imovel.midias && imovel.midias.length > 0) {
      const arquivo = imovel.midias[0].arquivo;
      return arquivo.startsWith("http")
        ? arquivo
        : `${API_BASE_URL}${arquivo}`;
    }
    return null;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusStyle = (status) => {
    if (status === "disponivel") {
      return { text: "Disponível", color: "text-emerald-600", bg: "bg-emerald-100" };
    }
    return { text: "Indisponível", color: "text-red-600", bg: "bg-red-100" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full font-[Poppins]">
        <p className="text-lg text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (selectedImovel) {
    return (
      <DetalhesImovel
        imovel={selectedImovel}
        onBack={() => setSelectedImovel(null)}
        API_BASE_URL={API_BASE_URL}
      />
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white font-[Poppins] overflow-y-auto">
      <header className="px-4 sm:px-8 pt-4 sm:pt-8 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Olá, {user?.username || "Usuário"}!
        </h1>
      </header>

      <div className="px-4 sm:px-8 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Digite o local do imóvel"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-5 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {showPriceFilter ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-11">
              <span className="text-xs font-bold text-gray-500">R$</span>
              <input
                type="number" min="0" step="0.01" placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                className="w-20 h-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-gray-300 font-bold text-xs">—</span>
              <span className="text-xs font-bold text-gray-500">R$</span>
              <input
                type="number" min="0" step="0.01" placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                className="w-20 h-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={() => { setPriceRange({ min: "", max: "" }); setShowPriceFilter(false); }}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPriceFilter(true)}
              className={`h-11 w-11 flex items-center justify-center rounded-xl transition shrink-0 ${
                (priceRange.min || priceRange.max)
                  ? "bg-[#219EBC] text-white border border-[#219EBC]"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
              aria-label="Filtros"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-8 pb-8">
        {filteredImoveis.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-semibold text-gray-300">
              {showFavorites
                ? "Nenhum imóvel favoritado ainda"
                : searchTerm
                  ? "Nenhum imóvel encontrado para esta busca"
                  : "Nenhum imóvel disponível no momento"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredImoveis.map((imovel) => {
              const { rua, cidade } = parseEndereco(imovel.endereco);
              const statusStyle = getStatusStyle(imovel.status);
              const imageUrl = getImageUrl(imovel);

              return (
                <div
                  key={imovel.id}
                  onClick={() => setSelectedImovel(imovel)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer p-5 sm:p-5 flex flex-col"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#219EBC] overflow-hidden bg-gray-100 flex items-center justify-center">
                      {imageUrl && !imgErrors[imovel.id] ? (
                        <img
                          src={imageUrl}
                          alt="Imóvel"
                          className="w-full h-full object-cover"
                          onError={() => setImgErrors((p) => ({ ...p, [imovel.id]: true }))}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#219EBC]/10 to-[#219EBC]/5">
                          <svg className="w-12 h-12 text-[#219EBC]/40" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9.2V7c0-.6-.4-1-1-1h-1V4c0-.6-.4-1-1-1s-1 .4-1 1v1.4l-3-2.7c-.3-.3-.7-.3-1 0L2.2 9.2c-.4.4-.5 1-.2 1.4.3.4.9.5 1.3.2l.7-.6V20c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-9.8l.7.6c.2.2.4.3.7.3.2 0 .5-.1.7-.3.3-.4.2-1-.2-1.4zM7 17v-5h2v5H7zm4 0v-5h2v5h-2zm6 0h-2v-5h2v5z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-2">
                    <span className="text-lg sm:text-xl font-bold text-[#FF9E64]">
                      {formatCurrency(imovel.valor || 0)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600 flex-1">
                    {rua && (
                      <p className="leading-snug">
                        <span className="font-semibold text-gray-800">Endereço:</span> {rua}
                      </p>
                    )}
                    {cidade && (
                      <p className="leading-snug">
                        <span className="font-semibold text-gray-800">Cidade:</span> {cidade}
                      </p>
                    )}
                    {imovel.descricao && (
                      <p className="line-clamp-2 leading-snug">
                        <span className="font-semibold text-gray-800">Descrição:</span> {imovel.descricao}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.color}`}
                    >
                      {statusStyle.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
