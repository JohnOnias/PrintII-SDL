from decimal import Decimal, InvalidOperation

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Imovel
from .serializers import ImovelSerializer
from .permissions import IsLocador, IsOwnerOrReadOnly, IsLocatario
from rest_framework.decorators import api_view, permission_classes

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
    """Filtra imóveis por endereco, categoria, tipo, valor (min/max), garagem, suite e quartos.
        GET /filter/?endereco=rua
        GET /filter/?categoria=residencial&valor_min=100&valor_max=500
        GET /filter/?tipo=casa,apartamento&garagem=true&suite=true&quartos=3
    """
    queryset = Imovel.objects.all()
    endereco = request.GET.get('endereco')
    categoria = request.GET.get('categoria')
    tipo = request.GET.get('tipo')
    valor = request.GET.get('valor')
    valor_min = request.GET.get('valor_min')
    valor_max = request.GET.get('valor_max')
    garagem = request.GET.get('garagem')
    suite = request.GET.get('suite')
    quartos = request.GET.get('quartos')
    area_min = request.GET.get('area_min')

    if endereco:
        try:
            _validate_text_field(endereco, 'endereco')
        except ValueError as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        queryset = queryset.filter(endereco__icontains=endereco)
    if categoria:
        # Suporta múltiplas categorias separadas por vírgula
        categorias = [c.strip() for c in categoria.split(',') if c.strip()]
        if categorias:
            queryset = queryset.filter(categoria__in=categorias)
    if tipo:
        # Suporta múltiplos tipos separados por vírgula
        tipos = [t.strip() for t in tipo.split(',') if t.strip()]
        if tipos:
            queryset = queryset.filter(tipo__in=tipos)
    if valor:
        try:
            valor_decimal = Decimal(valor)
            queryset = queryset.filter(valor=valor_decimal)
        except (InvalidOperation, ValueError):
            return Response(
                {'detail': 'Valor inválido. Use um número válido para o parâmetro valor.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    if valor_min:
        try:
            valor_min_decimal = Decimal(valor_min)
            queryset = queryset.filter(valor__gte=valor_min_decimal)
        except (InvalidOperation, ValueError):
            return Response(
                {'detail': 'Valor mínimo inválido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    if valor_max:
        try:
            valor_max_decimal = Decimal(valor_max)
            queryset = queryset.filter(valor__lte=valor_max_decimal)
        except (InvalidOperation, ValueError):
            return Response(
                {'detail': 'Valor máximo inválido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    if garagem and garagem.lower() == 'true':
        queryset = queryset.filter(garagem=True)
    if suite and suite.lower() == 'true':
        queryset = queryset.filter(suite=True)
    if quartos:
        try:
            quartos_int = int(quartos)
            queryset = queryset.filter(quartos__gte=quartos_int)
        except ValueError:
            return Response(
                {'detail': 'Número de quartos inválido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    if area_min:
        try:
            area_min_int = int(area_min)
            queryset = queryset.filter(area__gte=area_min_int)
        except ValueError:
            return Response(
                {'detail': 'Área mínima inválida.'},
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
        # list e retrieve também exigem autenticação
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(locador=self.request.user)
