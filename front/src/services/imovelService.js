const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/imoveis/`;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Se for FormData, o navegador define o Content-Type automaticamente com o boundary correto
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

export async function getImoveis() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Erro ao buscar imóveis");
  }
  return data;
}

export async function getImovel(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Erro ao buscar detalhes do imóvel");
  }
  return data;
}

export async function createImovel(imovelData) {
  const isFormData = imovelData instanceof FormData;
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(isFormData),
    body: isFormData ? imovelData : JSON.stringify(imovelData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Erro ao criar imóvel");
  }
  return data;
}

export async function updateImovel(id, imovelData) {
  const isFormData = imovelData instanceof FormData;

  const response = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: getHeaders(isFormData),
    body: isFormData ? imovelData : JSON.stringify(imovelData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Erro ao atualizar imóvel");
  }
  return data;
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
