import React, { useEffect, useState } from "react";
import { getImoveis } from "../../services/imovelService";
import IconMap from "../../assets/imgs/map.png";
import IconStar from "../../assets/imgs/star.png";



export default function ListarImoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
const [currentImages, setCurrentImages] = useState({});


  useEffect(() => {
    async function carregarImoveis() {
      try {
        const data = await getImoveis();
              console.log("IMÓVEIS DA API:", data);

        setImoveis(data);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarImoveis();
  }, []);

  if (loading) {
    return <p>Carregando imóveis...</p>;
  }
const nextImage = (imovelId, total) => {
  setCurrentImages((prev) => ({
    ...prev,
    [imovelId]: ((prev[imovelId] || 0) + 1) % total,
  }));
};

const prevImage = (imovelId, total) => {
  setCurrentImages((prev) => ({
    ...prev,
    [imovelId]:
      ((prev[imovelId] || 0) - 1 + total) % total,
  }));
};



  return (

<>
 <h1 className="text-3xl font-bold p-4 border-solid border-1 rounded-xl mb-10 mt-5 ml-2 mr-2 text-center top-0 ">
        Imoveis disponiveis no momento
      </h1>


    <div className="p-5 flex h-screen flex-col justify-center">
     

   <div className="grid grid-cols-3 gap-4">
  {imoveis.map((imovel) => {
    const currentIndex = currentImages[imovel.id] || 0;

    const imagemAtual =
      imovel.midias && imovel.midias.length > 0
        ? imovel.midias[currentIndex].arquivo
        : "https://via.placeholder.com/300x200?text=Sem+Imagem";

    return (
      <div
        key={imovel.id}
        className="border rounded-xl p-4 shadow"
      >


  <p className="h-10 w-50 "> Favoritar <img src={IconStar} alt="" className="h-5 w-5" /></p>
        <div className="relative">
          <img
            src={imagemAtual}
            alt={imovel.categoria}
            className="w-full h-48 object-cover rounded-md mb-3"
          />

  

          {imovel.midias && imovel.midias.length > 1 && (
            <>
              {/* Botão anterior */}
              <button
                onClick={() =>
                  prevImage(imovel.id, imovel.midias.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
              >
                ←
              </button>

              {/* Botão próximo */}
              <button
                onClick={() =>
                  nextImage(imovel.id, imovel.midias.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
              >
                →
              </button>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold">
          {imovel.categoria}
        </h2>

        <p>
          <img
            src={IconMap}
            alt="Mapa"
            className="w-5 h-5 inline-block mr-2"
          />
          {imovel.endereco}
        </p>

        <br />
         <p className="font-bold text-green-600">
          {imovel.status}
        </p>

        <p className="font-bold text-green-600">
          R$ {imovel.valor}
        </p>
      </div>
    );
  })}
</div>
    </div>
  </>
  );
}