from decimal import Decimal, InvalidOperation

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Imovel, ImovelFavorito
from .serializers import ImovelSerializer
from .permissions import IsLocador, IsOwnerOrReadOnly, IsLocatario
from rest_framework.decorators import api_view, permission_classes, action

# Validar tipo de dados de entrada
def _validate_text_field(value, field_name):
    if any(char.isdigit() for char in value):
        raise ValueError(f'O campo {field_name} não pode conter números.')


def _validate_numeric_field(value, field_name):
    if not value.isdigit():
        raise ValueError(f'O campo {field_name} deve conter apenas números.')


# filtrar imóveis
# Somente locatários autenticados podem acessar este filtro.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_imovel(request):
    """Filtra imóveis por endereco, categoria, tipo e valor.
        GET /filter/?endereco=rua
        GET /filter/?categoria=residencial&valor=1200.00
        GET /filter/?tipo=casa&categoria=comercial&endereco=centro
    """
    queryset = Imovel.objects.all()
    endereco = request.GET.get('endereco')
    categoria = request.GET.get('categoria')
    tipo = request.GET.get('tipo')
    valor = request.GET.get('valor')

    if endereco:
        try:
            _validate_text_field(endereco, 'endereco')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=endereco)
    if categoria:
        queryset = queryset.filter(categoria__iexact=categoria)
    if tipo:
        queryset = queryset.filter(tipo__iexact=tipo)
    if valor:
        try:
            valor_decimal = Decimal(valor)
            queryset = queryset.filter(valor=valor_decimal)
        except (InvalidOperation, ValueError):
            return Response(
                {'detail': 'Valor inválido. Use um número válido para o parâmetro valor.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

    serializer = ImovelSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def searchImovel(request):
    """Pesquisa imóveis por número, nome da rua, bairro ou endereço.
        GET /search/?numero=123
        GET /search/?rua=Flores
        GET /search/?bairro=Centro
        GET /search/?endereco=Rua+das+Flores
        Pode combinar parâmetros: GET /search/?rua=Flores&bairro=Centro
    """
    queryset = Imovel.objects.filter(status=Imovel.StatusChoices.DISPONIVEL)
    numero = request.GET.get('numero')
    rua = request.GET.get('rua')
    bairro = request.GET.get('bairro')
    endereco = request.GET.get('endereco')

    if numero:
        try:
            _validate_numeric_field(numero, 'numero')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=numero)
    if rua:
        try:
            _validate_text_field(rua, 'rua')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=rua)
    if bairro:
        try:
            _validate_text_field(bairro, 'bairro')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=bairro)
    if endereco:
        try:
            _validate_text_field(endereco, 'endereco')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=endereco)

    serializer = ImovelSerializer(queryset, many=True)
    return Response(serializer.data)

class ImovelViewSet(viewsets.ModelViewSet):
    serializer_class = ImovelSerializer
    
    def get_queryset(self):
        """
        Retorna o queryset base.
        Para ações de edição (update, partial_update, destroy), 
        filtramos apenas pelos imóveis do próprio usuário para garantir 404 se não for o dono.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            # Se não estiver logado, não pode editar nada (retorna queryset vazio)
            if self.request.user.is_anonymous:
                return Imovel.objects.none()
            return Imovel.objects.filter(locador=self.request.user)
        return Imovel.objects.all()
    
    def get_permissions(self):
        """
        Instancia e retorna a lista de permissões que a view requer.
        """
        if self.action == 'create':
            return [IsLocador()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        if self.action in ['favoritar', 'desfavoritar', 'favoritos']:
            return [IsAuthenticated(), IsLocatario()]
        # Mudado de AllowAny para IsAuthenticated para satisfazer os requisitos de segurança
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(locador=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsLocatario])
    def favoritar(self, request, pk=None):
        imovel = self.get_object()
        
        # A2: Imóvel indisponível
        if imovel.status != Imovel.StatusChoices.DISPONIVEL:
            return Response(
                {'detail': 'Este imóvel não está disponível para ser favoritado.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            favorite, created = ImovelFavorito.objects.get_or_create(
                usuario=request.user,
                imovel=imovel
            )
            
            if not created:
                # A3: Imóvel já favoritado
                return Response(
                    {'detail': 'Este imóvel já está na sua lista de favoritos.'},
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {'detail': 'Imóvel adicionado aos favoritos com sucesso.'},
                status=status.HTTP_201_CREATED
            )
        except Exception:
            # A4: Falha ao salvar favorito
            return Response(
                {'detail': 'Ocorreu um erro ao tentar favoritar o imóvel. Por favor, tente novamente.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['delete'], url_path='favoritar', permission_classes=[IsAuthenticated, IsLocatario])
    def desfavoritar(self, request, pk=None):
        imovel = self.get_object()
        deleted_count, _ = ImovelFavorito.objects.filter(
            usuario=request.user,
            imovel=imovel
        ).delete()
        
        if deleted_count == 0:
            return Response(
                {'detail': 'Este imóvel não estava na sua lista de favoritos.'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        return Response(
            {'detail': 'Imóvel removido dos favoritos com sucesso.'},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsLocatario])
    def favoritos(self, request):
        favoritos = Imovel.objects.filter(favoritado_por__usuario=request.user)
        serializer = self.get_serializer(favoritos, many=True)
        return Response(serializer.data)
