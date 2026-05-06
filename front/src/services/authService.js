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

function parseErrorMessage(data) {
  if (!data) return "Erro no cadastro";
  if (typeof data === "string") return data;
  if (data.error) return data.error;
  if (data.message) return data.message;
  if (typeof data === "object") {
    const values = Object.values(data)
      .flat()
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
    return values.filter(Boolean).join(" ") || "Erro no cadastro";
  }
  return "Erro no cadastro";
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
    idade: "25", // valor padrão
    rua: "Não informado", // valor padrão
    bairro: "Não informado", // valor padrão
    cidade: "Cedro",
    estado: "CE",
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
    throw new Error(parseErrorMessage(data));
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