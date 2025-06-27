# crm_backend/core/urls.py

from django.urls import path, include
from .views import (
    CustomerListAPIView, CustomerCreateAPIView, CustomerDetailUpdateDeleteAPIView,
    CompanyListAPIView, CompanyDetailAPIView,
    InteractionListCreateAPIView, InteractionDetailUpdateDeleteAPIView,UserListAPIView # Importa las vistas de interacción
)

urlpatterns = [
    path('customers/', CustomerListAPIView.as_view(), name='customer-list'),
    path('customers/create/', CustomerCreateAPIView.as_view(), name='customer-create'), # Para la creación
    path('customers/<int:pk>/', CustomerDetailUpdateDeleteAPIView.as_view(), name='customer-detail'), # Para detalle, edición, eliminación

    path('companies/', CompanyListAPIView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyDetailAPIView.as_view(), name='company-detail'),

    # Rutas anidadas para interacciones (opcional, pero útil)
    path('customers/<int:customer_pk>/interactions/', InteractionListCreateAPIView.as_view(), name='customer-interactions-list-create'),
    path('customers/<int:customer_pk>/interactions/<int:pk>/', InteractionDetailUpdateDeleteAPIView.as_view(), name='customer-interactions-detail-update-delete'),
    
    
     # <-- Vuelve a añadir esta línea para los usuarios
    path('users/', UserListAPIView.as_view(), name='user-list')

    # Ruta para todas las interacciones (si no están anidadas)
    # path('interactions/', InteractionListCreateAPIView.as_view(), name='interaction-list-create'),
    # path('interactions/<int:pk>/', InteractionDetailUpdateDeleteAPIView.as_view(), name='interaction-detail-update-delete'),
]