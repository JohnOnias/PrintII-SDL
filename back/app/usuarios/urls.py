from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Autenticação
    path('register', views.create, name='register'),
    path('login', views.login, name='login'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Usuários
    path('create', views.create),  # Mantido para compatibilidade
    path('all', views.list_all_users),
    path('perfil', views.profile, name='profile'),
    path('buscar/<int:user_id>', views.get_user_by_id, name='get_user_by_id'),
    path('type_user', views.type_user, name='type_user'),
    path('update', views.update),
    path('esqueci-senha', views.request_password_reset, name='request_password_reset'),
    path('redefinir-senha', views.confirm_password_reset, name='confirm_password_reset'),
]
