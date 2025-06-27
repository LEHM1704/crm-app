# crm_backend/core/models.py

from django.db import models
from django.contrib.auth.models import User # Importamos el modelo User de Django
from django.utils import timezone
from datetime import date
from django.contrib.humanize.templatetags.humanize import naturaltime

class BaseModel(models.Model):
    """
    Clase base abstracta para añadir campos de fecha de creación y actualización.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True # Marca esta clase como abstracta para que no cree una tabla en la DB

class Company(BaseModel):
    """
    Modelo para representar las compañías a las que pertenecen los clientes.
    """
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)


    class Meta:
        verbose_name_plural = "Companies" # Para que el nombre en el admin sea correcto
        ordering = ['name'] # Ordenar por nombre por defecto

    def __str__(self):
        return self.name

class Customer(BaseModel):
    """
    Modelo para representar a los clientes.
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='customers')
    sales_representative = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,related_name='customers_managed')
    

    class Meta:
        ordering = ['last_name', 'first_name'] # Ordenar por apellido y luego nombre

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def birthday_formatted(self):
        if self.date_of_birth:
           # Retorna la fecha en formato DD/MM/YYYY
            return self.date_of_birth.strftime("%d/%m/%Y")
        return "N/A"
    
    

    @property
    def latest_interaction(self):
        last_interaction = self.interactions.order_by('-interaction_date').first()
        if last_interaction:
            # Calcula el "tiempo hace" de forma dinámica
            time_ago_str = naturaltime(last_interaction.interaction_date)
            return {
                'type': last_interaction.get_type_display(), # Muestra el nombre legible del tipo
                'time_ago': time_ago_str
            }
        return None

class Interaction(BaseModel):
    """
    Modelo para registrar las interacciones entre un representante y un cliente.
    """
    INTERACTION_TYPES = [
        ('Call', 'Llamada'),
        ('Email', 'Correo Electrónico'),
        ('SMS', 'SMS'),
        ('Facebook', 'Facebook Messenger'),
        ('WhatsApp', 'WhatsApp'),
        ('Meeting', 'Reunión'),
        ('Other', 'Otro'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    interaction_date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True) # Campo adicional para notas de la interacción

    class Meta:
        ordering = ['-interaction_date'] # Ordenar por fecha de interacción descendente
        get_latest_by = 'interaction_date' # Para obtener la última interacción fácilmente

    def __str__(self):
        return f"{self.interaction_type} con {self.customer.full_name} el {self.interaction_date.strftime('%Y-%m-%d %H:%M')}"