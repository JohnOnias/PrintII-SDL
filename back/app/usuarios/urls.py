from django.urls import path
from . import views

urlpatterns = [
    path("criar/", views.create)
]
