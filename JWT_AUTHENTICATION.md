# Sistema de Autenticação JWT

Este documento descreve como usar o sistema de autenticação JWT implementado no projeto.

## O que é JWT?

JWT (JSON Web Token) é um padrão de autenticação que permite que usuários se autentiquem uma vez e recebam um token para fazer requisições autenticadas sem precisar enviar as credenciais a cada requisição.

## Endpoints de Autenticação

### 1. Registrar Novo Usuário
**POST** `/usuarios/register`

**Corpo da Requisição:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "senha_segura",
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

**Resposta (201 Created):**
```json
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
```

### 2. Login (Obter Tokens)
**POST** `/usuarios/login`

**Corpo da Requisição:**
```json
{
  "email": "john@example.com",
  "password": "senha_segura"
}
```

**Resposta (200 OK):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "usuario": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "tipo_de_usuario": "locador"
  }
}
```

### 3. Renovar Token de Acesso
**POST** `/usuarios/token/refresh`

**Corpo da Requisição:**
```json
{
  "refresh": "seu_refresh_token_aqui"
}
```

**Resposta (200 OK):**
```json
{
  "access": "novo_access_token_aqui"
}
```

## Como Usar os Tokens

### Headers de Autenticação
Após obter o `access` token no login, inclua-o em todas as requisições protegidas no header `Authorization`:

```
Authorization: Bearer seu_access_token_aqui
```

### Exemplo com cURL:
```bash
curl -X GET http://localhost:8000/usuarios/all \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Exemplo com JavaScript/Fetch:
```javascript
const token = localStorage.getItem('accessToken');

fetch('http://localhost:8000/usuarios/all', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Exemplo com Axios:
```javascript
import axios from 'axios';

const token = localStorage.getItem('accessToken');

axios.get('http://localhost:8000/usuarios/all', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

## Configuração JWT

As configurações JWT estão em `back/settings.py`:

- **ACCESS_TOKEN_LIFETIME**: 1 hora
- **REFRESH_TOKEN_LIFETIME**: 1 dia
- **ALGORITHM**: HS256 (HMAC com SHA-256)

Para alterar estas configurações, edite a seção `SIMPLE_JWT` em `settings.py`.

## Tipos de Usuário

O sistema suporta dois tipos de usuários:

1. **locador** - Proprietário que aluga imóveis
2. **locatario** - Inquilino que aluga imóveis

## Fluxo de Autenticação Recomendado

### Frontend (React/Vue):

1. **Registro:**
   ```javascript
   const response = await fetch('/usuarios/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(userData)
   });
   ```

2. **Login:**
   ```javascript
   const response = await fetch('/usuarios/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   
   const data = await response.json();
   localStorage.setItem('accessToken', data.access);
   localStorage.setItem('refreshToken', data.refresh);
   localStorage.setItem('usuario', JSON.stringify(data.usuario));
   ```

3. **Requisições Autenticadas:**
   ```javascript
   const token = localStorage.getItem('accessToken');
   
   const response = await fetch('/usuarios/all', {
     method: 'GET',
     headers: { 
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

4. **Renovar Token (quando expirar):**
   ```javascript
   const refreshToken = localStorage.getItem('refreshToken');
   
   const response = await fetch('/usuarios/token/refresh', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ refresh: refreshToken })
   });
   
   const data = await response.json();
   localStorage.setItem('accessToken', data.access);
   ```

## Tratamento de Erros

### 401 Unauthorized
O token expirou ou é inválido. Faça login novamente ou use o refresh token.

### 403 Forbidden
Você não tem permissão para acessar este recurso.

### 400 Bad Request
Os dados enviados são inválidos. Verifique o formato.

## Segurança

- ⚠️ **Nunca** armazene tokens em `localStorage` em produção com informações sensíveis sem HTTPS
- Sempre use HTTPS em produção
- Implemente CORS adequadamente
- Considere usar cookies HttpOnly para armazenar refresh tokens
- Implemente logout (apagar tokens do cliente)

## Próximos Passos

1. Implemente refresh automático de tokens no frontend
2. Adicione logout (remova tokens do localStorage)
3. Implemente permissões baseadas em tipo de usuário
4. Adicione validação de email
5. Implemente recuperação de senha
