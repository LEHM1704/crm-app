# [CRM-APP]

Este es un sistema de gestión de relaciones con clientes (CRM) desarrollado con Django REST Framework para el backend y React para el frontend. Permite gestionar clientes, compañías, interacciones y asignar representantes de ventas.

## Tabla de Contenidos

1.  [Características](#características)
2.  [Requisitos](#requisitos)
3.  [Configuración del Entorno](#configuración-del-entorno)
4.  [Ejecución del Proyecto](#ejecución-del-proyecto)
    - [Backend (Django)](#backend-django)
    - [Frontend (React)](#frontend-react)
5.  [Población de Datos (Opcional)](#población-de-datos-opcional)
6.  [Acceso a la Aplicación](#acceso-a-la-aplicación)
7.  [Estructura del Proyecto](#estructura-del-proyecto)
8.  [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## 1. Características

- Gestión de Clientes (CRUD: Crear, Leer, Actualizar, Eliminar).
- Asignación de Representantes de Ventas a Clientes.
- Gestión de Compañías asociadas a Clientes.
- Registro de Interacciones con Clientes.
- Listado de Clientes con búsqueda, ordenamiento y paginación.
- Visualización de la última interacción de un cliente.
- Interfaz de usuario intuitiva desarrollada con React y Tailwind CSS.

## 2. Requisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- **Python 3.8+**
- **pip** (gestor de paquetes de Python)
- **Node.js 14+**
- **npm** (gestor de paquetes de Node.js, incluido con Node.js)
- **Git** (para clonar el repositorio)

## 3. Configuración del Entorno

Sigue estos pasos para configurar tu entorno de desarrollo.

1.  **Clonar el Repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario-github/nombre-repositorio.git](https://github.com/tu-usuario-github/nombre-repositorio.git)
    cd nombre-repositorio # Navega a la carpeta raíz de tu proyecto
    ```

2.  **Configuración del Backend (Django):**

    - Navega a la carpeta `backend`:
      ```bash
      cd backend
      ```
    - Crea un entorno virtual (recomendado):
      ```bash
      python -m venv env
      ```
    - Activa el entorno virtual:
      - **Windows:**
        ```bash
        .\env\Scripts\activate
        ```
      - **macOS/Linux:**
        ```bash
        source env/bin/activate
        ```
    - Instala las dependencias de Python:
      ```bash
      pip install -r requirements.txt
      ```
      _(Si no tienes un `requirements.txt`, puedes crearlo con `pip freeze > requirements.txt` después de instalar tus dependencias manualmente: `pip install Django djangorestframework django-cors-headers django-filter django-humanize`)_
    - Aplica las migraciones de la base de datos:
      ```bash
      python manage.py migrate
      ```
    - Crea un superusuario para acceder al panel de administración de Django:
      ```bash
      python manage.py createsuperuser
      ```
      Sigue las instrucciones para crear tu usuario y contraseña.

3.  **Configuración del Frontend (React):**
    - Navega a la carpeta `frontend`:
      ```bash
      cd ../frontend # Vuelve a la raíz del proyecto y luego entra a frontend
      # O si ya estás en la raíz: cd frontend
      ```
    - Instala las dependencias de Node.js:
      ```bash
      npm install
      ```

## 4. Ejecución del Proyecto

Asegúrate de tener dos terminales abiertas, una para el backend y otra para el frontend.

### Backend (Django)

1.  Abre una terminal y navega a la carpeta `backend`.
2.  Activa tu entorno virtual (si no lo hiciste ya):
    - **Windows:** `.\env\Scripts\activate`
    - **macOS/Linux:** `source env/bin/activate`
3.  Inicia el servidor de desarrollo de Django:
    ```bash
    python manage.py runserver
    ```
    El backend estará disponible en `http://localhost:8000`.

### Frontend (React)

1.  Abre una **segunda terminal** y navega a la carpeta `frontend`.
2.  Inicia el servidor de desarrollo de React:
    ```bash
    npm run dev
    ```
    El frontend estará disponible en `http://localhost:5173` (o un puerto similar).

## 5. Población de Datos (Opcional)

Puedes poblar tu base de datos con algunos datos de prueba para empezar rápidamente.

1.  Asegúrate de que tu entorno virtual del backend esté activado y que estés en la carpeta `backend`.
2.  Puedes usar el shell de Django para crear datos manualmente:

    ```bash
    python manage.py shell
    ```

    Dentro del shell, puedes ejecutar comandos Python:

    ```python
    from django.contrib.auth.models import User
    from core.models import Company, Customer, Interaction
    from datetime import date, timedelta

    # Crear usuarios (representantes de ventas)
    user1, _ = User.objects.get_or_create(username='vendedor1', email='vendedor1@example.com', first_name='Juan', last_name='Perez')
    user1.set_password('password123')
    user1.save()

    user2, _ = User.objects.get_or_create(username='vendedor2', email='vendedor2@example.com', first_name='Maria', last_name='Gomez')
    user2.set_password('password123')
    user2.save()

    # Crear compañías
    company1, _ = Company.objects.get_or_create(name='Tech Solutions Inc.', defaults={'address': '123 Tech St', 'phone_number': '555-1234'})
    company2, _ = Company.objects.get_or_create(name='Global Innovations', defaults={'address': '456 Global Ave', 'phone_number': '555-5678'})

    # Crear clientes
    customer1, _ = Customer.objects.get_or_create(
        email='cliente1@example.com',
        defaults={
            'first_name': 'Ana',
            'last_name': 'Lopez',
            'phone_number': '111-222-3333',
            'address': 'Calle Falsa 123',
            'date_of_birth': date(1990, 5, 15),
            'company': company1,
            'sales_representative': user1
        }
    )

    customer2, _ = Customer.objects.get_or_create(
        email='cliente2@example.com',
        defaults={
            'first_name': 'Pedro',
            'last_name': 'Ramirez',
            'phone_number': '444-555-6666',
            'address': 'Av. Siempre Viva 742',
            'date_of_birth': date(1985, 11, 20),
            'company': company2,
            'sales_representative': user2
        }
    )

    # Crear interacciones
    Interaction.objects.get_or_create(
        customer=customer1,
        interaction_type='CALL',
        defaults={'notes': 'Llamada inicial para presentar productos.', 'interaction_date': date.today() - timedelta(days=7)}
    )
    Interaction.objects.get_or_create(
        customer=customer1,
        interaction_type='EMAIL',
        defaults={'notes': 'Envío de propuesta de servicios.', 'interaction_date': date.today() - timedelta(days=3)}
    )
    Interaction.objects.get_or_create(
        customer=customer2,
        interaction_type='MEETING',
        defaults={'notes': 'Reunión para discutir necesidades.', 'interaction_date': date.today() - timedelta(days=10)}
    )

    print("Datos de prueba creados/actualizados.")
    exit() # Salir del shell
    ```

    - **Nota:** Este script usa `get_or_create` para evitar duplicados si lo ejecutas varias veces.

## 6. Acceso a la Aplicación

Una vez que ambos servidores (backend y frontend) estén corriendo:

- Abre tu navegador web y ve a: `http://localhost:5173`
- Desde aquí podrás ver la lista de clientes, crear nuevos, editar existentes y ver sus detalles e interacciones.

## 7. Estructura del Proyecto
