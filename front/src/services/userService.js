// ===============================
// 📦 USER LOCAL STORAGE
// ===============================

const API_URL = "http://localhost:8000";

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user) return null;

  return JSON.parse(user);
}

export async function getProfile() {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");

  if (!token) throw new Error("Não autenticado");

  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar perfil");
  }

  const data = await response.json();
  
  // Atualiza o localStorage com os dados frescos
  localStorage.setItem("user", JSON.stringify(data));
  
  return data;
}

export async function updateUser(userData) {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");

  if (!token) throw new Error("Não autenticado");

  const response = await fetch(`${API_URL}/usuarios/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao atualizar perfil");
  }

  const data = await response.json();
  
  // Atualiza o localStorage com os dados retornados do servidor
  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

  window.location.href = "/login";
}