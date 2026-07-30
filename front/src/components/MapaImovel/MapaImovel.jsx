import React, { useState } from "react";

export default function MapaImovel({ endereco }) {
  const [loading, setLoading] = useState(true);

  const cleanAddress = () => {
    if (!endereco) return "";
    return endereco
      .replace(/,\s*CEP:\s*[\d\-\.]+/gi, "")
      .replace(/\(.*?\)/g, "")
      .trim()
      .replace(/,\s*$/, "");
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress())}`,
      "_blank"
    );
  };

  if (!endereco) return null;

  const encodedAddress = encodeURIComponent(cleanAddress());

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">Localização</span>
        </div>
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#219EBC] hover:text-[#1a86a1] transition"
        >
          <span>Abrir no Google Maps</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      {/* Mapa */}
      <div className="relative" style={{ height: "280px" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-[3px] border-gray-300 border-t-[#219EBC] rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-medium">Carregando mapa...</span>
            </div>
          </div>
        )}

        <div
          className="relative w-full h-full cursor-pointer group z-20"
          onClick={openGoogleMaps}
          title="Clique para abrir no Google Maps"
        >
          <iframe
            title="Localização do Imóvel"
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: "none" }}
            loading="lazy"
            onLoad={() => setLoading(false)}
            src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
          {/* Overlay para clique */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors flex items-end justify-center pb-3">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#219EBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">Abrir no Google Maps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
