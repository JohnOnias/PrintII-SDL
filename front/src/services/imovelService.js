const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8001"}/imoveis/`;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");
  
  const headers = {};
  
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

export async function getImoveis() {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Erro ao buscar imóveis");
  }
  return response.json();
}

export async function getImovelById(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Erro ao buscar detalhes do imóvel");
  }
  return response.json();
}

export async function createImovel(data) {
  const isFormData = data instanceof FormData;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || JSON.stringify(data) || "Erro ao cadastrar imóvel");
  }
  return response.json();
}

export async function updateImovel(id, data) {
  const isFormData = data instanceof FormData;
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || JSON.stringify(data) || "Erro ao atualizar imóvel");
  }
  return response.json();
}

export async function deleteImovel(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Erro ao deletar imóvel");
  }
  return true;
}

export async function filterImoveis(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.tipo) params.append("tipo", filtros.tipo);
  if (filtros.valor_min) params.append("valor_min", filtros.valor_min);
  if (filtros.valor_max) params.append("valor_max", filtros.valor_max);
  if (filtros.garagem) params.append("garagem", "true");
  if (filtros.suite) params.append("suite", "true");
  if (filtros.quartos) params.append("quartos", filtros.quartos);
  if (filtros.endereco) params.append("endereco", filtros.endereco);

  const response = await fetch(`${API_URL}filter/?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Erro ao filtrar imóveis");
  }
  return response.json();
}
