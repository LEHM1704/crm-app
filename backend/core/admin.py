# crm_backend/core/admin.py

from django.contrib import admin
from .models import Company, Customer, Interaction

admin.site.register(Company)
admin.site.register(Customer)
admin.site.register(Interaction)