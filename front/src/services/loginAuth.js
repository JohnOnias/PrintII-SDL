localStorage.setItem("access", data.access);

// 🔥 SALVA DADOS DO USUÁRIO (SE EXISTIREM)
if (data.user) {
  localStorage.setItem("user", JSON.stringify(data.user));
}