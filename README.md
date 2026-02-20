# RenderX

![RenderX](https://img.shields.io/badge/RenderX-project-8A2BE2)
![Frontend](https://img.shields.io/badge/frontend-Next.js_15-000000)
![Backend](https://img.shields.io/badge/backend-Django-092E20)
![License](https://img.shields.io/badge/license-MIT-green)

Simple e-commerce app with a Next.js frontend and Django REST API backend.

- Frontend: `frontend/`
- Backend: `backend/`

---

## What is implemented

- User registration and login (JWT)
- Product list, product details, product search
- Cart add/remove/update quantity
- Admin-only product create/update/delete
- MySQL database
- Optional media storage in Google Cloud Storage

---

## Project layout

- `frontend/` - Next.js app (UI, auth pages, products, cart)
- `backend/` - Django REST API (auth, products, cart, DB)

---

## Running the project

### 1) Backend

From repo root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
# install Django and backend dependencies
python manage.py migrate
python manage.py runserver
```

Default backend URL: `http://localhost:8000`

Required env vars (database):

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

Optional:

- SSL DB vars: `DB_CA_CERT_PATH`, `DB_CLIENT_CERT_PATH`, `DB_CLIENT_KEY_PATH`
- GCS vars and `service-account.json` if you want cloud media storage

### 2) Frontend

From repo root:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:3000`

Ensure the backend is reachable at the URL defined in `frontend/api/auth.api.ts` (e.g. `http://localhost:8000`) or update `API_URL` accordingly.

---

## API summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST   | `/register/` | No  | Body: `username`, `email`, `password` |
| POST   | `/login/`    | No  | Body: `email`, `password`; returns `access`, `user`; sets `refresh_token` cookie |
| POST   | `/logout/`   | No  | Clears refresh cookie |
| POST   | `/refresh/`  | No  | Cookie: `refresh_token`; returns new `access`, `user` |
| GET    | `/products/` | No  | List products |
| POST   | `/products/` | Admin | Create product |
| GET    | `/products/<id>/` | No  | Product detail |
| PUT    | `/products/<id>/` | Admin | Update product (partial) |
| DELETE | `/products/<id>/` | Admin | Delete product |
| GET    | `/productsearch/?name=&category=&min_price=&max_price=` | No  | Filter products |
| GET    | `/cart/`     | JWT | Current user cart |
| POST   | `/cart/`     | JWT | Body: `product_id`, `quantity` |
| DELETE | `/cart/remove/<id>/` | JWT | Remove item by product id |

More request/response details: `backend/README.md`.

---

## Screenshots

Put screenshots in `docs/screenshots/` and link them here.

### UI

- Home / products / product detail / cart:
  - `![UI main](./docs/screenshots/ui-main.png)`
  - `![UI products](./docs/screenshots/ui-products.png)`
  - `![UI cart](./docs/screenshots/ui-cart.png)`

### Database

- Schema / ERD / tables:
  - `![DB schema](./docs/screenshots/db-schema.png)`
  - `![DB tables](./docs/screenshots/db-tables.png)`

---

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, axios
- Backend: Django, Django REST Framework, Simple JWT, MySQL
