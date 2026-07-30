const API_URL = "http://localhost:8001";

/* =========================
   LOGIN
========================= */
export async function loginAuth(email, password) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("🔥 ERRO BACKEND COMPLETO:", data);
    throw new Error(
      data.detail ||
      data.error ||
      JSON.stringify(data) ||
      "Erro no login"
    );
  }

  // 🔥 salva token
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  
  console.log("✅ Token salvo no localStorage:", {
    access: data.access ? data.access.substring(0, 20) + "..." : null,
    refresh: data.refresh ? data.refresh.substring(0, 20) + "..." : null
  });

  // 🔥 salva usuário
  if (data.usuario) {
    localStorage.setItem("user", JSON.stringify(data.usuario));
  } else if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  } else {
    const fakeUser = {
      email,
      username: email.split("@")[0],
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
  }

  return data;
}

/* =========================
   CADASTRO
========================= */
export async function cadastroAuth(formData) {
  const response = await fetch(`${API_URL}/usuarios/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("🔥 ERRO COMPLETO DO DJANGO:", data);
    throw new Error(
      data.error || JSON.stringify(data, null, 2)
    );
  }

  if (data.access && data.refresh) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  }

  if (data.usuario) {
    localStorage.setItem("user", JSON.stringify(data.usuario));
  }

  return data;
}

/* =========================
   REFRESH TOKEN
========================= */
export async function refreshTokenAuth(refreshToken) {
  const response = await fetch(`${API_URL}/usuarios/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao renovar token");
  }

  return data;
}

/* =========================
   REDEFINIR SENHA
========================= */
export async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/usuarios/esqueci-senha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao solicitar redefinição de senha");
  }

  return data;
}

export async function confirmPasswordReset(uid, token, new_password) {
  const response = await fetch(`${API_URL}/usuarios/redefinir-senha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ uid, token, new_password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao redefinir senha");
  }

  return data;
}
