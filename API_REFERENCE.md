# Referência Completa da API REST com JWT

## Base URL
```
http://localhost:8000
```

## Autenticação

Todos os endpoints (exceto `/login`, `/register`) requerem o header:
```
Authorization: Bearer <access_token>
```

---

## Endpoints de Autenticação

### 1. Registrar Novo Usuário
```http
POST /usuarios/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "senha_forte",
  "cpf": "12345678900",
  "idade": "25",
  "sexo": "M",
  "profissao": "Desenvolvedor",
  "rua": "Rua Principal",
  "bairro": "Centro",
  "cidade": "Cedro",
  "estado": "CE",
  "numero": 123,
  "tipo_de_usuario": "locador"
}
```

**Respostas:**
- `201 Created` - Usuário criado com sucesso
- `400 Bad Request` - Dados inválidos

---

### 2. Fazer Login
```http
POST /usuarios/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "senha_forte"
}
```

**Resposta 200 OK:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxMzg2NzAzNCwiaWF0IjoxNzEzNzgwNjM0LCJqdGkiOiI5ZmJhNDQzYmRhMGQ0YjFmOTBhOTU5NTY3YmZiZjYwZiIsInVzZXJfaWQiOjF9.xxxx",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODUzMjM0LCJpYXQiOjE3MTM3ODA2MzQsImp0aSI6IjExYzdlZTM5ZTcxMjRjZjk5MWQyZmQ1ZjIyYjI3ZTcxIiwidXNlcl9pZCI6MX0.yyyy",
  "usuario": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "tipo_de_usuario": "locador"
  }
}
```

**Respostas:**
- `200 OK` - Login bem-sucedido
- `401 Unauthorized` - Credenciais inválidas

---

### 3. Renovar Access Token
```http
POST /usuarios/token/refresh
Content-Type: application/json

{
  "refresh": "seu_refresh_token_aqui"
}
```

**Resposta 200 OK:**
```json
{
  "access": "novo_access_token_aqui"
}
```

**Respostas:**
- `200 OK` - Token renovado
- `401 Unauthorized` - Refresh token inválido/expirado

---

## Endpoints de Usuários

### 1. Listar Todos os Usuários
```http
GET /usuarios/all
Authorization: Bearer <access_token>
```

**Resposta 200 OK:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "cpf": "12345678900",
    "idade": "25",
    "sexo": "M",
    "profissao": "Desenvolvedor",
    "rua": "Rua Principal",
    "bairro": "Centro",
    "cidade": "Cedro",
    "estado": "CE",
    "numero": 123,
    "email": "john@example.com",
    "tipo_de_usuario": "locador"
  }
]
```

---

### 2. Criar Usuário (alternativo)
```http
POST /usuarios/create
Content-Type: application/json

{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "senha_forte",
  "cpf": "98765432100",
  "idade": "28",
  "sexo": "F",
  "profissao": "Designer",
  "rua": "Avenida Central",
  "bairro": "Bairro Novo",
  "cidade": "Cedro",
  "estado": "CE",
  "numero": 456,
  "tipo_de_usuario": "locatario"
}
```

---

### 3. Atualizar Usuário
```http
PUT /usuarios/update/<id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "john_updated",
  "profissao": "Senior Developer"
}
```

---

### 4. Deletar Usuário
```http
DELETE /usuarios/destroy/<id>
Authorization: Bearer <access_token>
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Server Error - Erro no servidor |

---

## Exemplo de Fluxo Completo

### 1. Registrar
```bash
curl -X POST http://localhost:8000/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "cpf": "12345678900",
    "idade": "25",
    "sexo": "M",
    "profissao": "Dev",
    "rua": "Rua Test",
    "bairro": "Centro",
    "cidade": "Cedro",
    "estado": "CE",
    "numero": 123,
    "tipo_de_usuario": "locador"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:8000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Salvar `access_token` e `refresh_token` da resposta.

### 3. Fazer Requisição Autenticada
```bash
curl -X GET http://localhost:8000/usuarios/all \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

### 4. Renovar Token (se expirar)
```bash
curl -X POST http://localhost:8000/usuarios/token/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "SEU_REFRESH_TOKEN_AQUI"
  }'
```

---

## Campos Obrigatórios

### No Registro/Criação de Usuário:
- `username` (string, max 100)
- `email` (string, email válido)
- `password` (string, recomenda-se mín 8 caracteres)
- `cpf` (string, 11 dígitos)
- `idade` (string)
- `sexo` (string)
- `profissao` (string)
- `rua` (string)
- `bairro` (string)
- `numero` (integer)
- `tipo_de_usuario` (string: "locador" ou "locatario")

### Campos com Valor Padrão:
- `cidade` = "Cedro"
- `estado` = "CE"

---

## Tipos de Usuário Suportados

| Tipo | Descrição |
|------|-----------|
| `locador` | Proprietário que oferece imóveis para aluguel |
| `locatario` | Inquilino que aluga imóveis |

---

## Notas Importantes

1. **Tokens JWT**: 
   - Access Token expira em **1 hora**
   - Refresh Token expira em **1 dia**

2. **Senha**:
   - A senha é **hasheada** e armazenada com segurança
   - Nunca é retornada nas respostas

3. **CORS**:
   - Configure CORS no Django se o frontend estiver em domínio diferente

4. **Segurança**:
   - Use HTTPS em produção
   - Nunca exponha o SECRET_KEY
   - Implemente rate limiting
   - Valide entrada do usuário no frontend

---

## Exemplo com Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Registrar
response = requests.post(
    f"{BASE_URL}/usuarios/register",
    json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPass123!",
        "cpf": "12345678900",
        "idade": "25",
        "sexo": "M",
        "profissao": "Dev",
        "rua": "Rua Test",
        "bairro": "Centro",
        "cidade": "Cedro",
        "estado": "CE",
        "numero": 123,
        "tipo_de_usuario": "locador"
    }
)

# 2. Login
response = requests.post(
    f"{BASE_URL}/usuarios/login",
    json={
        "email": "test@example.com",
        "password": "TestPass123!"
    }
)

data = response.json()
access_token = data['access']
refresh_token = data['refresh']

# 3. Fazer requisição autenticada
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(f"{BASE_URL}/usuarios/all", headers=headers)

print(response.json())
```

---

## Exemplo com JavaScript Fetch API

```javascript
const BASE_URL = "http://localhost:8000";

// 1. Registrar
const registerResponse = await fetch(`${BASE_URL}/usuarios/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser",
    email: "test@example.com",
    password: "TestPass123!",
    cpf: "12345678900",
    idade: "25",
    sexo: "M",
    profissao: "Dev",
    rua: "Rua Test",
    bairro: "Centro",
    cidade: "Cedro",
    estado: "CE",
    numero: 123,
    tipo_de_usuario: "locador"
  })
});

// 2. Login
const loginResponse = await fetch(`${BASE_URL}/usuarios/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    password: "TestPass123!"
  })
});

const { access_token, refresh_token } = await loginResponse.json();

// 3. Fazer requisição autenticada
const allResponse = await fetch(`${BASE_URL}/usuarios/all`, {
  headers: { Authorization: `Bearer ${access_token}` }
});

console.log(await allResponse.json());
```
