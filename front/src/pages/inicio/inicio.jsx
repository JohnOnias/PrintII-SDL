import React, { useEffect, useState } from "react";
import { getImoveis, deleteImovel } from "../../services/imovelService";
import { getProfile } from "../../services/userService";
import CadastroImovel from "../cadastroImovel/CadastroImovel";
import cat404 from "../../assets/imgs/404_CAT.png";

export default function Inicio({ isHome = true }) {
  const [user, setUser] = useState(null);
  const [imoveis, setImoveis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function loadData() {
    let userData = null;
    try {
      userData = await getProfile();
      setUser(userData);
    } catch (err) {
      console.error("ERRO AO BUSCAR USER ONLINE:", err);
      // Fallback para local
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) {
        userData = localUser;
        setUser(localUser);
      } else {
        // Se nem local tem, vai pro login
        window.location.href = "/login";
        return;
      }
    }

    // Agora busca os imóveis se for locador
    if (userData?.tipo_de_usuario === 'locador') {
      try {
        const imoveisData = await getImoveis();
        // Filtra apenas os imóveis do locador logado
        setImoveis(imoveisData.filter(i => i.locador === userData.id));
      } catch (err) {
        console.error("ERRO AO BUSCAR IMÓVEIS:", err);
      }
    }
    
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      try {
        await deleteImovel(id);
        setImoveis(imoveis.filter(i => i.id !== id));
      } catch (err) {
        alert("Erro ao excluir imóvel: " + err.message);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading || !user) {
    return <div className="p-10 flex items-center justify-center h-full text-lg">Carregando...</div>;
  }

  // SE FOR TELA DE INÍCIO OU LOCATÁRIO, MOSTRA 404
  if (isHome || user.tipo_de_usuario !== 'locador') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white font-[Poppins] p-4">
        <img src={cat404} alt="Não foi possível carregar" className="max-w-full max-h-[400px] mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Não foi possível carregar</h2>
      </div>
    );
  }

  // LAYOUT MEUS IMÓVEIS (LOCADOR)
  return (
    <div className="flex flex-col h-full w-full bg-white font-[Poppins]">
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="bg-white px-8 py-6 flex items-center gap-4">
          <button className="text-gray-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-medium text-gray-500">
            Olá, {user.username}!
          </h1>
        </header>

        {/* CONTEÚDO LOCADOR */}
        <div className="flex-1 px-8 md:px-16 py-4">
          
          <h2 className="text-2xl font-bold text-black mb-8">
            Meus Imóveis
          </h2>

          <div className="flex flex-col items-center">
            
            {/* BOTÃO CADASTRAR - CENTRALIZADO E TEAL */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-[500px] bg-[#219EBC] py-3 rounded-2xl text-2xl font-bold text-white shadow-md transition hover:bg-[#1a86a1] mb-12"
            >
              Cadastrar Novo Imóvel
            </button>

            {/* LISTA DE IMÓVEIS GRID */}
            <div className="w-full flex justify-center">
              {imoveis.length === 0 ? (
                <div className="w-full max-w-[700px] py-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                   <p className="text-xl font-bold text-gray-300">Nenhum imóvel cadastrado ainda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[900px]">
                  {imoveis.map(imovel => {
                    const hasImage = imovel.midias && imovel.midias.length > 0;
                    let imageUrl = null;
                    if (hasImage) {
                      const arquivo = imovel.midias[0].arquivo;
                      imageUrl = arquivo.startsWith('http') ? arquivo : `${API_BASE_URL}${arquivo}`;
                    }

                    return (
                      <div key={imovel.id} className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col min-h-[420px]">
                        
                        {/* TOP ACTIONS */}
                        <div className="flex justify-between items-start mb-4">
                          <button className="flex items-center gap-1 border border-gray-300 rounded px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase">
                            Status <span className="text-[8px]">▼</span>
                          </button>
                          <button className="text-black font-bold text-xl">⋮</button>
                        </div>

                        {/* CIRCULAR IMAGE AREA */}
                        <div className="flex justify-center mb-8 relative">
                           <div className="relative w-40 h-40 rounded-full border-[5px] border-[#219EBC] p-1 bg-white overflow-visible">
                              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {imageUrl ? (
                                  <img src={imageUrl} alt="Imóvel" className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                  </svg>
                                )}
                              </div>
                              {/* EDIT ICON OVERLAY */}
                              <div className="absolute bottom-1 right-1 bg-[#219EBC] w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                 </svg>
                              </div>
                           </div>
                        </div>

                        {/* INFO SECTION */}
                        <div className="space-y-2 text-sm text-gray-700 flex-1">
                          <p><span className="font-bold text-black">Endereço:</span> {imovel.endereco}</p>
                          <p><span className="font-bold text-black">Cidade:</span> {imovel.cidade} - {imovel.estado}</p>
                          <p className="line-clamp-3"><span className="font-bold text-black">Descrição:</span> {imovel.descricao}</p>
                        </div>

                        {/* PRICE TAG - PEACH COLOR */}
                        <div className="flex justify-end mt-4">
                          <div className="bg-[#FFE5D9] px-4 py-1.5 rounded-full">
                            <span className="text-sm font-bold text-[#FF9E64]">
                              {formatCurrency(imovel.valor || 0).replace('R$', 'R$ ')}
                            </span>
                          </div>
                        </div>

                        {/* DELETE BUTTON */}
                        <button 
                          onClick={() => handleDelete(imovel.id)}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
        {/* MODAL DE CADASTRO */}
        <CadastroImovel 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
}

