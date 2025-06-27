from django.shortcuts import render

# Create your views here.
# crm_backend/core/views.py

from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max, Q # Q para OR en filtros
from datetime import date, timedelta
from .models import Company, Customer, Interaction
from django.contrib.auth.models import User
from .serializers import CompanySerializer, CustomerSerializer, InteractionSerializer, UserSerializer

# Paginación personalizada para la lista de clientes
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10 # Número de elementos por página
    page_size_query_param = 'page_size' # Permite cambiar el tamaño de página con ?page_size=X
    max_page_size = 100 # Tamaño máximo de página permitido
    
class CompanyListAPIView(generics.ListAPIView):
    queryset = Company.objects.all().order_by('name') # Ordena por nombre
    serializer_class = CompanySerializer
    # No se necesita paginación para una lista simple de compañías en un selector

class CompanyDetailAPIView(generics.RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

# --- Vistas para Company ---
class CompanyListCreateAPIView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']

class CompanyRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

# --- Vistas para Customer ---
class CustomerListAPIView(generics.ListAPIView):
    queryset = Customer.objects.all().order_by('first_name')
    serializer_class = CustomerSerializer
    pagination_class = StandardResultsSetPagination # Aplicamos la paginación
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number', 'company__name', 'sales_representative__username']
    ordering_fields = [
        'first_name', 'last_name', 'email', 'date_of_birth',
        'company__name',
        'sales_representative__username', # <-- Vuelve a añadir esta línea
        'created_at', 'updated_at',
        'last_interaction_date'
    ]
    def get_queryset(self):
        queryset = Customer.objects.all().select_related('company', 'sales_representative').prefetch_related('interactions')

        # Anotar la última fecha de interacción para cada cliente
        # Esto nos permite ordenar por la última interacción
        queryset = queryset.annotate(
            latest_interaction_date=Max('interactions__interaction_date')
        )

        # Filtro por cumpleaños esta semana/mes
        birthday_filter = self.request.query_params.get('birthday_filter', None)
        if birthday_filter:
            today = date.today()
            if birthday_filter == 'this_week':
                # Lunes de esta semana
                start_of_week = today - timedelta(days=today.weekday())
                # Domingo de esta semana
                end_of_week = start_of_week + timedelta(days=6)
                queryset = queryset.filter(
                    Q(date_of_birth__month=start_of_week.month, date_of_birth__day__gte=start_of_week.day) |
                    Q(date_of_birth__month=end_of_week.month, date_of_birth__day__lte=end_of_week.day)
                )
                # Nota: Este filtro es simplificado y no maneja cruces de año
                # Para un manejo robusto de cumpleaños en un rango que cruza el fin de año,
                # se necesitaría una lógica más compleja o una función de base de datos.
                # Para la demo, esto es suficiente.

            elif birthday_filter == 'this_month':
                queryset = queryset.filter(date_of_birth__month=today.month)
            elif birthday_filter == 'today':
                queryset = queryset.filter(date_of_birth__month=today.month, date_of_birth__day=today.day)

        return queryset
class CustomerCreateAPIView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
class CustomerDetailUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field = 'pk' # Por defecto es 'pk', pero es bueno ser explícito

class CustomerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# --- Vistas para Interaction ---
class InteractionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = InteractionSerializer
    # filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    # filterset_fields = ['customer']
    # ordering_fields = ['interaction_date']

    def get_queryset(self):
        # Filtra interacciones por cliente si se pasa customer_id en la URL o query param
        customer_id = self.kwargs.get('customer_pk') # Si usas nested routes como /customers/{pk}/interactions
        if customer_id:
            return Interaction.objects.filter(customer_id=customer_id).order_by('-interaction_date')
        return Interaction.objects.all().order_by('-interaction_date')

    def perform_create(self, serializer):
        customer_id = self.kwargs.get('customer_pk')
        customer = Customer.objects.get(pk=customer_id)
        serializer.save(customer=customer)
class InteractionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    
class InteractionDetailUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interaction.objects.all()
    serializer_class = InteractionSerializer
    lookup_field = 'pk'
    
class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer 
