/**
 * Busca informações de endereço a partir de um CEP usando a API ViaCEP.
 * @param {string} cep - O CEP a ser consultado (com ou sem formatação).
 * @returns {Promise<Object>} - Os dados do endereço ou erro se não encontrado.
 */
export async function fetchAddressByCEP(cep) {
  const cleanedCEP = cep.replace(/\D/g, "");

  if (cleanedCEP.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos");
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
    cep: data.cep,
  };
}
