// ===============================
// 📦 USER LOCAL STORAGE
// ===============================

const API_URL = "http://localhost:8000";

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined" || user === "null") return null;

  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

export async function getProfile() {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");

  if (!token || token === "undefined" || token === "null") {
      console.warn("⚠️ Tentativa de buscar perfil sem token");
      throw new Error("Não autenticado");
  }

  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
        console.error("🚫 Token inválido ou expirado");
        // Opcional: logout() ou redirecionar
    }
    throw new Error("Erro ao buscar perfil");
  }

  const data = await response.json();
  
  // Atualiza o localStorage com os dados frescos
  localStorage.setItem("user", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("user-updated"));
  
  return data;
}

export async function updateUser(userData) {
  const token = localStorage.getItem("access") || localStorage.getItem("access_token");

  if (!token || token === "undefined" || token === "null") throw new Error("Não autenticado");

  const isFormData = userData instanceof FormData;
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json; charset=utf-8";
  }

  const response = await fetch(`${API_URL}/usuarios/update`, {
    method: "PUT",
    headers: headers,
    body: isFormData ? userData : JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.detail || "Erro ao atualizar perfil");
  }

  const data = await response.json();
  
  // Atualiza o localStorage com os dados retornados do servidor
  localStorage.setItem("user", JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("user-updated"));

  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.removeItem("access_token"); // redundância

  window.location.href = "/login";
}