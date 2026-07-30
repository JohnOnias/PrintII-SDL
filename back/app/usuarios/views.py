from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from .email_handler import EmailService
from .models import User
from .serializer import UserSerializer, TypeUserSerializer, PublicUserSerializer, LoginSerializer, UpdateUserSerializer

# IsAuthenticated - só usuário logado pode acessar
# AllowAny - qualquer usuário pode acessar

#################################### GET #########################################

# MEU PERFIL - Retorna dados do usuário autenticado
@api_view(['GET'])
@permission_classes([AllowAny])
def profile(request):
    user = request.user
    
    print(f"DEBUG: Acessando perfil. User: {user}, Authenticated: {user.is_authenticated}")

    if user.is_anonymous:
        # Se for anônimo, tentamos pegar o primeiro usuário apenas para dev
        # mas idealmente o frontend deve lidar com o 401 se não houver token
        from .models import User
        user = User.objects.first()
        if not user:
             return Response({'error': 'Nenhum usuário cadastrado no sistema'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def type_user(request):
    user = request.user  # já vem autenticado pelo JWT

    serializer = TypeUserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)

# BUSCAR USUÁRIO POR ID - Retorna dados públicos de qualquer usuário (SEM AUTENTICAÇÃO)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_by_id(request, user_id):
    try:
        usuario = User.objects.get(id=user_id)
        serializer = PublicUserSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuário não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Erro ao buscar usuário: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_users(request):
    usuarios = User.objects.all()
    serializer = PublicUserSerializer(usuarios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


################################# POST ###########################################

# CRIAR USUÁRIO
@api_view(['POST'])
@permission_classes([AllowAny])
def create(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        # Verificar duplicatas antes de salvar
        email = serializer.validated_data.get('email')
        cpf = serializer.validated_data.get('cpf')
        username = serializer.validated_data.get('username')

        # Verificar se email já existe
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Este email já está cadastrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar se CPF já existe
        if User.objects.filter(cpf=cpf).exists():
            return Response(
                {'error': 'Este CPF já está cadastrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verificar se username já existe
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Este username já está em uso'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Se passou todas as validações, salvar
        user = serializer.save()
        
        # Gerar tokens para auto-login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'usuario': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN - Gera tokens JWT
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        usuario = serializer.validated_data['usuario']
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'usuario': UserSerializer(usuario).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# REFRESH TOKEN - Gera novo access token usando o refresh token
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    from rest_framework_simplejwt.views import TokenRefreshView
    return TokenRefreshView.as_view()(request)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def destroy(request):
    user = request.user
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update(request):
    usuario = request.user  # O usuário autenticado pode alterar apenas seu próprio perfil

    serializer = UpdateUserSerializer(usuario, data=request.data, partial=True)

    if serializer.is_valid():
        # Verificar duplicatas para email e username, se fornecidos
        email = serializer.validated_data.get('email')
        username = serializer.validated_data.get('username')

        if email and User.objects.filter(email=email).exclude(id=usuario.id).exists():
            return Response(
                {'error': 'Este email já está cadastrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if username and User.objects.filter(username=username).exclude(id=usuario.id).exists():
            return Response(
                {'error': 'Este username já está em uso'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Salvar as alterações
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Usar iexact para busca insensível a maiúsculas/minúsculas
        user = User.objects.get(email__iexact=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Link para o frontend (padrão Vite: 5173)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/redefinir-senha?uid={uid}&token={token}"
        
        # IMPRIMIR NO CONSOLE PARA FACILITAR TESTES
        print("\n" + "="*50)
        print(f"🔗 LINK DE REDEFINIÇÃO DE SENHA GERADO PARA {email}:")
        print(f"{reset_link}")
        print("="*50 + "\n")

        # Enviar e-mail usando o serviço dedicado
        email_sent = EmailService.send_password_reset_email(user, reset_link)

        if email_sent:
            return Response({'message': 'E-mail de redefinição enviado com sucesso'}, status=status.HTTP_200_OK)
        else:
            # Se falhar o envio de e-mail (comum em dev), retornamos o link se estiver em DEBUG
            if settings.DEBUG:
                return Response({
                    'message': 'O servidor de e-mail falhou (comum em desenvolvimento), mas o link foi gerado no console.',
                    'link_debug': reset_link
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Falha ao enviar e-mail de redefinição. Tente novamente mais tarde.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except User.DoesNotExist:
        # Por segurança, retornamos 200 mesmo se o usuário não existir para evitar enumeração de e-mails
        return Response({'message': 'Se o e-mail existir, um link de redefinição será enviado.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uidb64, token, new_password]):
        return Response({'error': 'Parâmetros insuficientes'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
        
    if user is not None and default_token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Senha alterada com sucesso'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Token inválido ou expirado'}, status=status.HTTP_400_BAD_REQUEST)
