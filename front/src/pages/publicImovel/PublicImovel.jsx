import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetalhesImovel from "../listarImoveis/DetalhesImovel";

export default function PublicImovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchImovel() {
      try {
        const response = await fetch(`${API_BASE_URL}/imoveis/${id}/`);
        if (!response.ok) throw new Error("Imóvel não encontrado");
        const data = await response.json();
        setImovel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImovel();
  }, [id, API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full font-[Poppins]">
        <p className="text-lg text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error || !imovel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full font-[Poppins] px-4">
        <p className="text-2xl font-bold text-gray-300 mb-2">Imóvel não encontrado</p>
        <p className="text-sm text-gray-400 mb-6">O link que você acessou pode estar incorreto ou o imóvel foi removido.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#219EBC] text-white rounded-xl font-semibold text-sm hover:bg-[#1a86a1] transition"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      <div className="max-w-4xl mx-auto">
        <DetalhesImovel
          imovel={imovel}
          onBack={() => navigate("/")}
          API_BASE_URL={API_BASE_URL}
        />
      </div>
    </div>
  );
}
