# crm_backend/core/management/commands/populate_db.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from core.models import Company, Customer, Interaction
from faker import Faker
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Populates the database with dummy data for Users, Companies, Customers, and Interactions.'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before populating.')

    def handle(self, *args, **options):
        fake = Faker('es_ES') # Usamos español para nombres y fechas
        clear_data = options['clear']

        if clear_data:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            Interaction.objects.all().delete()
            Customer.objects.all().delete()
            Company.objects.all().delete()
            # No eliminamos usuarios existentes para mantener el superusuario si existe
            # Si quieres borrar los usuarios creados por el script, necesitarías una lógica específica.
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # --- 1. Crear 3 Representantes (Users) ---
        self.stdout.write('Creating 3 sales representatives...')
        sales_reps = []
        for i in range(3):
            # Asegurarse de que el usuario no exista para evitar IntegrityError
            try:
                user = User.objects.create_user(
                    username=f'rep{i+1}',
                    email=f'rep{i+1}@example.com',
                    password='password123',
                    first_name=fake.first_name(),
                    last_name=fake.last_name()
                )
                sales_reps.append(user)
                self.stdout.write(f'  Created user: {user.username}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  Could not create user rep{i+1}: {e}. Skipping.'))
                # Si el usuario ya existe, intentamos recuperarlo
                existing_user = User.objects.filter(username=f'rep{i+1}').first()
                if existing_user:
                    sales_reps.append(existing_user)
                    self.stdout.write(f'  Using existing user: {existing_user.username}')
        if not sales_reps:
            self.stdout.write(self.style.ERROR('No sales representatives available. Aborting population.'))
            return # Salir si no hay representantes para asignar

        # --- 2. Crear Compañías (ej. 50) ---
        self.stdout.write('Creating 50 companies...')
        companies = []
        for _ in range(50):
            companies.append(Company.objects.create(name=fake.unique.company()))
        self.stdout.write(f'Created {len(companies)} companies.')

        # --- 3. Crear 500 Clientes ---
        self.stdout.write('Creating 1000 customers...')
        customers = []
        for _ in range(500):
            customer = Customer.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=70),
                company=random.choice(companies),
                sales_representative=random.choice(sales_reps)
            )
            customers.append(customer)
            if (_ + 1) % 100 == 0:
                self.stdout.write(f'  Created {_ + 1} customers...')
        self.stdout.write(f'Created {len(customers)} customers.')

        # --- 4. Crear Interacciones (500 por Cliente) ---
        self.stdout.write('Creating interactions (this might take a while, ~500,000 interactions)...')
        interaction_types = [choice[0] for choice in Interaction.INTERACTION_TYPES]
        total_interactions = 0

        # Para un mejor rendimiento en inserciones masivas
        interactions_to_create = []

        for customer in customers:
            for _ in range(1):
                interaction_date = fake.date_time_between(start_date='-2y', end_date='now', tzinfo=None) # Últimos 2 años
                interaction_type = random.choice(interaction_types)
                interactions_to_create.append(
                    Interaction(
                        customer=customer,
                        interaction_type=interaction_type,
                        interaction_date=interaction_date,
                        notes=fake.sentence(nb_words=10) # Una pequeña nota
                    )
                )
                if len(interactions_to_create) >= 5000: # Insertar en lotes de 5000
                    Interaction.objects.bulk_create(interactions_to_create)
                    total_interactions += len(interactions_to_create)
                    self.stdout.write(f'  Inserted {total_interactions} interactions so far...')
                    interactions_to_create = []

        # Insertar cualquier interacción restante
        if interactions_to_create:
            Interaction.objects.bulk_create(interactions_to_create)
            total_interactions += len(interactions_to_create)

        self.stdout.write(self.style.SUCCESS(f'Finished creating {total_interactions} interactions.'))
        self.stdout.write(self.style.SUCCESS('Database population complete!'))