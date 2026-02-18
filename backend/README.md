## RenderX Backend – Podstawowa dokumentacja API

  

**Bazowy URL (dev)**: `http://localhost:8000/`

---
### **Autoryzacja i użytkownicy**

- #### **Rejestracja użytkownika**

  - **URL**: `POST /register/`

  - **Body (JSON)**:

    ```json

    {

      "username": "testuser",

      "email": "user@example.com",

      "password": "haslo123"

    }

    ```

  - **Odpowiedź 201**:

    ```json

    {

      "message": "User testuser created successfully!"

    }

    ```

  

- #### **Logowanie (JWT)**

  - **URL**: `POST /login/`

  - **Body (JSON)**:

    ```json

    {

      "email": "user@example.com",

      "password": "haslo123"

    }

    ```

  - **Odpowiedź 200** (przykład):

    ```json

    {

      "access": "<ACCESS_TOKEN>",

      "user": {

        "username": "testuser",

        "email": "user@example.com"

      }

    }

    ```

  - Dodatkowo w **cookie HTTP-only** zapisywany jest `refresh_token`.

  

- **Wylogowanie**

  - **URL**: `POST /logout/`

  - Usuwa cookie `refresh_token`.

  - **Odpowiedź 200**:

    ```json

    {

      "message": "User logged out successfully"

    }

    ```

  

- #### **Odświeżenie tokenu dostępowego**

  - **URL**: `POST /refresh/`

  - **Wymagane**: cookie `refresh_token` (ustawione przy logowaniu).

  - **Odpowiedź 200** (przykład):

    ```json

    {

      "access": "<NEW_ACCESS_TOKEN>",

      "user": {

        "username": "testuser",

        "email": "user@example.com"

      }

    }

    ```

  

---

  

### **Produkty**

Większość operacji na produktach jest publicznie dostępna metodą `GET`. Operacje modyfikujące (`POST`, `PUT`, `DELETE`) są przeznaczone dla administratora.

- ####  **Lista produktów**

  - **URL**: `GET /products/`

  - **Odpowiedź 200** (przykład):

    ```json

    [

      {

        "id": 1,

        "name": "Produkt 1",

        "category": "kategoria",

        "price": 99.99

      }

    ]

    ```

  

- #### **Dodanie produktu** *(admin)*

  - **URL**: `POST /products/`

  - **Body (JSON – przykład)**:

    ```json

    {

      "name": "Nowy produkt",

      "category": "kategoria",

      "price": 49.99

    }

    ```

  

- #### **Szczegóły produktu**

  - **URL**: `GET /products/<product_id>/`

  - **Przykład**: `/products/1/`

  

- #### **Aktualizacja produktu** *(admin)*

  - **URL**: `PUT /products/<product_id>/`

  - **Body (JSON)** – te same pola co przy tworzeniu, mogą być częściowe (`partial update`).

  

- #### **Usunięcie produktu** *(admin)*

  - **URL**: `DELETE /products/<product_id>/`

  

- #### **Wyszukiwanie produktów**

  - **URL**: `GET /productsearch/`

  - **Parametry zapytania (opcjonalne)**:

    - `name` – fragment nazwy (np. `?name=lap`)

    - `category` – dokładna nazwa kategorii (np. `?category=laptopy`)

    - `min_price` – minimalna cena (np. `?min_price=100`)

    - `max_price` – maksymalna cena (np. `?max_price=1000`)

  - **Przykład pełnego zapytania**:

    - `/productsearch/?name=phone&category=elektronika&min_price=100&max_price=2000`

  

---

  

### **Uruchomienie projektu (skrót)**

  
- **Migracje**:

  ```bash

  python manage.py migrate

  ```

- **Uruchomienie serwera deweloperskiego**:

  ```bash

  python manage.py runserver

  ```