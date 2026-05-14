from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImovelViewSet, filter_imovel, searchImovel, favoritar_imovel, listar_favoritos

router = DefaultRouter()
router.register(r'', ImovelViewSet, basename='imovel')

urlpatterns = [
    path('filter/', filter_imovel, name='imovel-filter'),
    path('search/', searchImovel, name='imovel-search'),
    path('favoritar/', favoritar_imovel, name='imovel-favoritar'),
    path('favoritos/', listar_favoritos, name='imovel-favoritos'),
    path('', include(router.urls)),
]
