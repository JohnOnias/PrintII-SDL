# Resumo das Alterações - Sistema JWT

## ✅ O que foi implementado

### 1. Instalação de Dependências
- ✅ `djangorestframework-simplejwt` - Versão 5.5.1 (já estava instalada)
- ✅ `pyjwt` - Dependência de `djangorestframework-simplejwt`

### 2. Configuração Django (`back/settings.py`)

#### INSTALLED_APPS
```python
INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt'  # ← Adicionado
]
```

#### REST_FRAMEWORK
Atualizado com autenticação JWT:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ]
}
```

#### SIMPLE_JWT
Configuração completa de tokens JWT:
- Access Token lifetime: **1 hora**
- Refresh Token lifetime: **1 dia**
- Algoritmo: **HS256**

### 3. Correções no Serializer (`app/usuarios/serializer.py`)

#### Antes ❌
```python
fields = ['id', 'nome', 'cpf', ...] # campos errados
```

#### Depois ✅
```python
fields = ['id', 'username', 'cpf', 'tipo_de_usuario', ...]
```

#### Novo: LoginSerializer
```python
class LoginSerializer(serializers.Serializer):
    """Serializer para autenticação de usuários"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
```

### 4. Views Atualizadas (`app/usuarios/views.py`)

#### Novo - Endpoint de Login
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # Valida credenciais
    # Retorna access_token e refresh_token
```

#### Novo - Refresh Token
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    # Renova access token usando refresh token
```

#### Atualizado - Create
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def create(request):
    # Permite criação sem autenticação (público)
```

#### Atualizado - Outros Endpoints
```python
@api_view(['GET', 'DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def all, destroy, update(request):
    # Requerem autenticação
```

### 5. URLs Atualizadas (`app/usuarios/urls.py`)

**Novos endpoints:**
- `POST /usuarios/register` - Registrar usuário
- `POST /usuarios/login` - Fazer login e obter tokens
- `POST /usuarios/token/refresh` - Renovar access token

**Endpoints mantidos:**
- `GET /usuarios/all` - Listar usuários (requer auth)
- `PUT /usuarios/update/<id>` - Atualizar usuário (requer auth)
- `DELETE /usuarios/destroy/<id>` - Deletar usuário (requer auth)
- `POST /usuarios/create` - Criar usuário (compatibilidade)

### 6. Documentação Criada

#### 1. **JWT_AUTHENTICATION.md** 📖
- Explicação do JWT
- Como usar cada endpoint
- Exemplos com cURL, JavaScript, Axios
- Fluxo recomendado
- Tratamento de erros
- Dicas de segurança

#### 2. **API_REFERENCE.md** 📋
- Referência completa de todos os endpoints
- Exemplos de requisição/resposta
- Códigos HTTP
- Exemplos em cURL, Python e JavaScript

#### 3. **JWT_FRONTEND_INTEGRATION.js** ⚙️
- Configuração Axios com interceptores
- Serviço de autenticação
- Componente de login React
- Context de autenticação
- Rota protegida
- Hook customizado para fetch

#### 4. **test_jwt_auth.py** 🧪
- Script de teste completo
- Testa: Registro, Login, Refresh, Requisição Autenticada

---

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────┐
│ 1. USUÁRIO ACESSA LOGIN                            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 2. POST /usuarios/login                            │
│    { email, password }                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 3. SERVIDOR VALIDA E RETORNA TOKENS               │
│    { access_token, refresh_token, usuario }        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 4. FRONTEND ARMAZENA TOKENS (localStorage)         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 5. REQUISIÇÕES COM HEADER                          │
│    Authorization: Bearer <access_token>            │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌──────────┐
   │ TOKEN  │  │ TOKEN  │  │ TOKEN    │
   │ VÁLIDO │  │ EXPIRADO       │ INVÁLIDO │
   └────────┘  └────────┘  └──────────┘
       │           │           │
   ACESSO         RENOVAR      LOGOUT
   LIBERADO       TOKEN
                 (refresh)
```

---

## 🚀 Como Usar

### Backend - Iniciar servidor Django
```bash
cd back
python manage.py runserver
```

### Testar endpoints
```bash
cd back
python test_jwt_auth.py
```

### Frontend - Usar autenticação
1. Importar serviço: `import { authService } from '@/services/authService'`
2. Fazer login: `authService.login(email, password)`
3. Fazer requisições autenticadas com axios configurado
4. Renovar token automaticamente quando expirar

---

## 📊 Token JWT

### Access Token
- **Lifetime**: 1 hora
- **Uso**: Autenticar requisições
- **Storage**: localStorage (frontend)
- **Header**: `Authorization: Bearer <access_token>`

### Refresh Token
- **Lifetime**: 1 dia
- **Uso**: Renovar access token
- **Storage**: localStorage (frontend)
- **Endpoint**: `POST /usuarios/token/refresh`

---

## ⚙️ Configurações Importantes

| Configuração | Valor | Localização |
|-------------|--------|------------|
| ACCESS_TOKEN_LIFETIME | 1 hora | settings.py |
| REFRESH_TOKEN_LIFETIME | 1 dia | settings.py |
| ALGORITMO | HS256 | settings.py |
| SIGNING_KEY | SECRET_KEY | settings.py |
| AUTENTICAÇÃO PADRÃO | JWT | settings.py |
| PERMISSÃO PADRÃO | IsAuthenticated | settings.py |

---

## 🔒 Segurança

### ✅ Implementado
- ✅ Hashing de senhas com `make_password`
- ✅ Tokens com assinatura JWT
- ✅ Validação de credenciais
- ✅ Expiração de tokens
- ✅ Refresh token para renovação

### ⚠️ Recomendações para Produção
- Use HTTPS
- Configure CORS adequadamente
- Implemente rate limiting
- Use cookies HttpOnly para refresh tokens
- Adicione validação de email
- Implemente 2FA (autenticação de dois fatores)
- Monitore tentativas falhadas de login
- Implemente logout (revogação de tokens)

---

## 📝 Campos do Usuário

### Obrigatórios
- `username` (string, máx 100 caracteres)
- `email` (string, email válido)
- `password` (string, hasheado)
- `cpf` (string, 11 dígitos)
- `idade` (string)
- `sexo` (string)
- `profissao` (string)
- `rua` (string)
- `bairro` (string)
- `numero` (integer)
- `tipo_de_usuario` (string: "locador" ou "locatario")

### Com Valor Padrão
- `cidade` = "Cedro"
- `estado` = "CE"

### Automáticos
- `id` (auto-gerado)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 🐛 Troubleshooting

### "Token is invalid or expired"
→ Renovar token com refresh token ou fazer login novamente

### "Invalid token"
→ Verificar se o header Authorization está correto

### "CORS error"
→ Configurar CORS em settings.py

### "Password not valid"
→ A senha é obrigatória e deve ter pelo menos alguns caracteres

---

## 📚 Arquivos Modificados

```
back/
├── manage.py (sem alterações)
├── db.sqlite3 (sem alterações)
├── requeriments.txt (sem alterações - pypjwt já estava)
├── back/
│   └── settings.py ✏️ MODIFICADO
└── app/
    └── usuarios/
        ├── models.py (sem alterações)
        ├── serializer.py ✏️ MODIFICADO
        ├── views.py ✏️ MODIFICADO
        ├── urls.py ✏️ MODIFICADO
        └── migrations/ (sem alterações)

📄 NOVOS ARQUIVOS:
├── JWT_AUTHENTICATION.md (documentação)
├── API_REFERENCE.md (referência da API)
├── JWT_FRONTEND_INTEGRATION.js (exemplos frontend)
└── test_jwt_auth.py (script de teste)
```

---

## ✨ Próximos Passos Sugeridos

1. **Frontend**
   - [ ] Implementar login page
   - [ ] Implementar registro page
   - [ ] Implementar refresh automático de token
   - [ ] Implementar logout
   - [ ] Proteger rotas

2. **Backend**
   - [ ] Adicionar validação de email
   - [ ] Implementar recuperação de senha
   - [ ] Adicionar 2FA
   - [ ] Implementar rate limiting
   - [ ] Adicionar permissões por tipo de usuário

3. **Segurança**
   - [ ] Configurar CORS
   - [ ] HTTPS em produção
   - [ ] Revisar políticas de senha
   - [ ] Adicionar logging de segurança

---

## 📞 Suporte

Para mais informações, consulte:
- [Documentação JWT_AUTHENTICATION.md](./JWT_AUTHENTICATION.md)
- [Referência API_REFERENCE.md](./API_REFERENCE.md)
- [Integração Frontend](./front/JWT_FRONTEND_INTEGRATION.js)
- [Script de Teste](./back/test_jwt_auth.py)

---

**Data**: Abril 2026
**Status**: ✅ Completo e Testado
