import React, { useState, useEffect } from "react";

export default function DetalhesImovel({ imovel, onBack, API_BASE_URL }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMsg, setShowShareMsg] = useState(false);

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

  const getImageUrl = (midia) => {
    if (!midia) return null;
    const arquivo = midia.arquivo;
    return arquivo.startsWith("http") ? arquivo : `${API_BASE_URL}${arquivo}`;
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(imovel.id));
  }, [imovel.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(imovel.id)) {
      const updated = favorites.filter((id) => id !== imovel.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorited(false);
    } else {
      favorites.push(imovel.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorited(true);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/imovel/${imovel.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShowShareMsg(true);
      setTimeout(() => setShowShareMsg(false), 2000);
    } catch (err) {
      alert("Não foi possível copiar o link.");
    }
  };

  const { rua, cidade } = parseEndereco(imovel.endereco);
  const midias = imovel.midias || [];
  const images = midias.map(getImageUrl).filter(Boolean);

  const statusStyle =
    imovel.status === "disponivel"
      ? { text: "Disponível", color: "text-emerald-600", bg: "bg-emerald-100" }
      : { text: "Indisponível", color: "text-red-600", bg: "bg-red-100" };

  return (
    <div className="flex flex-col h-full w-full bg-white font-[Poppins] overflow-y-auto">
      <header className="px-4 sm:px-8 pt-4 sm:pt-8 pb-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#219EBC] transition"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Voltar</span>
        </button>
      </header>

      <div className="px-4 sm:px-8 pb-5">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-[#219EBC] overflow-hidden bg-gray-100 flex items-center justify-center mb-5">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt="Imóvel"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#219EBC]/10 to-[#219EBC]/5">
                <svg className="w-14 h-14 text-[#219EBC]/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9.2V7c0-.6-.4-1-1-1h-1V4c0-.6-.4-1-1-1s-1 .4-1 1v1.4l-3-2.7c-.3-.3-.7-.3-1 0L2.2 9.2c-.4.4-.5 1-.2 1.4.3.4.9.5 1.3.2l.7-.6V20c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-9.8l.7.6c.2.2.4.3.7.3.2 0 .5-.1.7-.3.3-.4.2-1-.2-1.4zM7 17v-5h2v5H7zm4 0v-5h2v5h-2zm6 0h-2v-5h2v5z"/>
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition w-full sm:w-auto justify-center ${
                isFavorited
                  ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-yellow-50"
              }`}
            >
              <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {isFavorited ? "Favoritado" : "Favoritar"}
            </button>

            <button
              onClick={() => {
                const tel = imovel.locador_telefone?.replace(/\D/g, "");
                if (tel) {
                  const waNumber = tel.startsWith("55") ? tel : `55${tel}`;
                  const msg = encodeURIComponent(
                    "Olá, tenho interesse no imóvel localizado em " +
                    imovel.endereco +
                    ". Gostaria de mais informações."
                  );
                  window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
                } else {
                  alert("Telefone do locador não disponível.");
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition w-full sm:w-auto justify-center bg-[#219EBC] text-white hover:bg-[#1a86a1]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Falar com Locador
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 pb-5">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 space-y-2.5">
          {rua && (
            <p className="text-sm text-gray-700 leading-snug">
              <span className="font-semibold text-gray-900">Endereço:</span> {rua}
            </p>
          )}
          {cidade && (
            <p className="text-sm text-gray-700 leading-snug">
              <span className="font-semibold text-gray-900">Cidade:</span> {cidade}
            </p>
          )}
          {imovel.descricao && (
            <p className="text-sm text-gray-700 leading-snug">
              <span className="font-semibold text-gray-900">Descrição:</span> {imovel.descricao}
            </p>
          )}
          <p className="text-sm text-gray-700 leading-snug">
            <span className="font-semibold text-gray-900">Status:</span>{" "}
            <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${statusStyle.bg} ${statusStyle.color}`}>
              {statusStyle.text}
            </span>
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="px-4 sm:px-8 pb-6">
          {images.slice(0, 2).length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                >
                  <img
                    src={img}
                    alt={"Foto " + (idx + 1)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
          {images.length > 2 && (
            <div className="grid grid-cols-3 gap-3">
              {images.slice(2, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx + 2)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                >
                  <img
                    src={img}
                    alt={"Foto " + (idx + 3)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
              <div
                onClick={() => {
                  if (images.length > 4) {
                    setSelectedPhotoIndex(4);
                  }
                }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
              >
                {images.length > 4 ? (
                  images.length > 5 ? (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                      <span className="text-2xl font-bold text-gray-400">+{images.length - 4}</span>
                    </div>
                  ) : (
                    <img
                      src={images[4]}
                      alt="Foto 5"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-4 sm:px-8 pb-8">
        <div className="relative inline-block w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar
          </button>
          {showShareMsg && (
            <span className="sm:absolute sm:top-0 sm:left-full sm:ml-3 block mt-2 sm:mt-0 text-center bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg">
              Link copiado!
            </span>
          )}
        </div>
      </div>

      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={images[selectedPhotoIndex]}
              alt={"Foto " + (selectedPhotoIndex + 1)}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="flex justify-center gap-4 mt-4">
              {selectedPhotoIndex > 0 && (
                <button
                  onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-semibold"
                >
                  Anterior
                </button>
              )}
              {selectedPhotoIndex < images.length - 1 && (
                <button
                  onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-semibold"
                >
                  Próxima
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
