const API_URL = "http://localhost:8000/imoveis/";

const getHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(imovelData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Erro ao criar imóvel");
  }
  return data;
}

export async function updateImovel(id, imovelData) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PATCH", // Usando PATCH para atualizações parciais
    headers: getHeaders(),
    body: JSON.stringify(imovelData),
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
