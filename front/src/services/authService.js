const API_URL = "http://localhost:8000";

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

  // 🔥 salva usuário (IMPORTANTE)
  if (data.usuario) {
    localStorage.setItem("user", JSON.stringify(data.usuario));
  } else if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  } else {
    // fallback caso backend não envie user
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
  const response = await fetch("http://localhost:8000/usuarios/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  // 🔥 MOSTRA EXATAMENTE O QUE O BACKEND ESTÁ DIZENDO
  if (!response.ok) {
    console.log("🔥 ERRO COMPLETO DO DJANGO:", data);

    throw new Error(
      JSON.stringify(data, null, 2)
    );
  }

  // 🔥 salva token para auto-login
  if (data.access && data.refresh) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    
    console.log("✅ Auto-login: Token salvo no localStorage");
  }

  // 🔥 salva usuário
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