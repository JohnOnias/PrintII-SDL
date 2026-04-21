export async function loginAuth(email, password) {
  const response = await fetch("http://localhost:8000/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro no login");
  }

  return data;
}