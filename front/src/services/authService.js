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

export async function cadastroAuth(formData) {
  // Mapear campos do formulário para os campos esperados pela API
  const dataToSend = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    cpf: formData.cpf,
    sexo: formData.sexo,
    profissao: formData.profissao,
    // Campos com valores padrão no backend
    idade: "25", // valor padrão
    rua: "Não informado", // valor padrão
    bairro: "Não informado", // valor padrão
    numero: 0, // valor padrão
    tipo_de_usuario: "locatario", // valor padrão
  };

  const response = await fetch("http://localhost:8000/usuarios/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro no cadastro");
  }

  return data;
}

export async function refreshTokenAuth(refreshToken) {
  const response = await fetch("http://localhost:8000/usuarios/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao renovar token");
  }

  return data;
}