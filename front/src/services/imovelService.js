const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/imoveis/`;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token") || localStorage.getItem("token");
  console.log("🔑 Token capturado:", token ? `Bearer ${token.substring(0, 20)}...` : "NENHUM TOKEN");
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
  const headers = getHeaders(isFormData);
  
  console.log("📤 Enviando POST /imoveis/ com headers:", headers);
  console.log("📤 Token completo:", headers.Authorization);
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: headers,
    body: isFormData ? imovelData : JSON.stringify(imovelData),
  });

  const data = await response.json();
  console.log("📥 Resposta:", response.status, data);
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
