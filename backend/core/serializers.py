# crm_backend/core/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Customer, Interaction
from django.utils import timezone
from django.contrib.humanize.templatetags.humanize import naturaltime
import humanize # Necesitarás instalar esta librería para el formato de tiempo

# Serializer para el modelo User (solo necesitamos el nombre y el ID para el representante)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

# Serializer para el modelo Company
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__' # Incluye todos los campos del modelo

# Serializer para el modelo Interaction
class InteractionSerializer(serializers.ModelSerializer):
    # Puedes añadir un campo calculado si quieres mostrar algo específico de la interacción
    # Por ejemplo, cuánto tiempo ha pasado desde la interacción
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Interaction
        fields = '__all__'
        read_only_fields = ['customer']
        
    def get_time_ago(self, obj):
        # Calcula el tiempo transcurrido desde la interacción
        return humanize.naturaltime(timezone.now() - obj.interaction_date)


# Serializer para el modelo Customer
# Este será el serializer principal para la lista de clientes
class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    birthday_formatted = serializers.CharField(read_only=True)

    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True, required=False, allow_null=True
    )

    sales_representative_full_name = serializers.CharField(source='sales_representative.get_full_name', read_only=True)
    sales_representative_username = serializers.CharField(source='sales_representative.username', read_only=True)
    sales_representative_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='sales_representative', write_only=True, required=False, allow_null=True
    )

    # *** ESTA ES LA LÍNEA CLAVE: El nombre del campo DEBE ser 'latest_interaction' ***
    latest_interaction = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Customer
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number', 'address',
            'date_of_birth', 'company', 'company_id',
            'sales_representative_full_name',
            'sales_representative_username',
            'sales_representative_id',
            'created_at', 'updated_at', 'full_name', 'birthday_formatted',
            'latest_interaction' # <-- Y aquí también debe ser 'latest_interaction'
        ]
        read_only_fields = ['created_at', 'updated_at']

    # *** ESTE ES EL MÉTODO CLAVE: Su nombre DEBE ser 'get_latest_interaction' ***
    def get_latest_interaction(self, obj):
        latest_interaction = obj.interactions.order_by('-interaction_date').first()
        if latest_interaction:
            # Importación local para evitar la importación circular si InteractionSerializer importa CustomerSerializer
            from .serializers import InteractionSerializer
            serializer = InteractionSerializer(latest_interaction)
            data = serializer.data
            data['time_ago'] = naturaltime(latest_interaction.interaction_date)
            data['type'] = latest_interaction.get_interaction_type_display()
            return data
        return None


    def create(self, validated_data):
        if 'sales_representative' not in validated_data and self.context.get('request') and self.context['request'].user.is_authenticated:
            validated_data['sales_representative'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'sales_representative' in validated_data:
            instance.sales_representative = validated_data.pop('sales_representative')
        return super().update(instance, validated_data)
