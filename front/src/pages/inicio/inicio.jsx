import React, { useEffect, useState } from "react";
import { getImoveis } from "../../services/imovelService";
import { getProfile } from "../../services/userService";
import CadastroImovel from "../cadastroImovel/CadastroImovel";
import cat404 from "../../assets/imgs/404_CAT.png";

export default function Inicio() {
  const [user, setUser] = useState(null);
  const [imoveis, setImoveis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadData();
  }, []);

  if (loading || !user) {
    return <div className="p-10 flex items-center justify-center h-full text-lg">Carregando...</div>;
  }

  const isLocador = user?.tipo_de_usuario === 'locador';

  if (!isLocador) {
    // LAYOUT LOCATÁRIO (Retornando apenas imagem 404 e mensagem)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white font-[Poppins] p-4">
        <img src={cat404} alt="Não foi possível carregar" className="max-w-full max-h-[400px] mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Não foi possível carregar</h2>
      </div>
    );
  }

  // LAYOUT LOCADOR (Conforme protótipo tela_imóveis_locador.png)
  return (
    <div className="flex flex-col h-full w-full bg-white font-[Poppins]">
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="bg-white px-8 py-8 flex items-center gap-4">
          <h1 className="text-2xl font-light text-slate-800">
            Olá, {user.username}!
          </h1>
        </header>

        {/* CONTEÚDO LOCADOR */}
        <div className="flex-1 px-12 py-6">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Meus Imóveis
          </h2>

          <div className="flex flex-col items-center">
            
            {/* BOTÃO CADASTRAR */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full max-w-[400px] bg-[#219EBC] py-3.5 rounded-full text-xl font-bold text-white shadow-md transition hover:bg-[#1a86a1] mb-12"
            >
              Cadastrar Novo Imóvel
            </button>

            {/* LISTA DE IMÓVEIS */}
            <div className="w-full max-w-[700px] min-h-[120px] rounded-md border border-gray-200 bg-white p-10 flex items-center justify-center shadow-sm">
              {imoveis.length === 0 ? (
                <p className="text-xl font-bold text-black">
                  Nenhum imóvel cadastrado ainda
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 w-full">
                  {imoveis.map(imovel => (
                    <div key={imovel.id} className="p-4 border rounded-lg hover:shadow-md transition">
                      <p className="font-bold">{imovel.endereco}</p>
                      <p className="text-sm text-gray-600">{imovel.tipo} - {imovel.categoria}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
{/* MODAL DE CADASTRO (O componente já é o modal) */}
<CadastroImovel 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
/>      </main>
    </div>
  );
}
