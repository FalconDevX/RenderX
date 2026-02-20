# RenderX

![RenderX](https://img.shields.io/badge/RenderX-project-8A2BE2)
![Frontend](https://img.shields.io/badge/frontend-Next.js_15-000000)
![Backend](https://img.shields.io/badge/backend-Django-092E20)
![License](https://img.shields.io/badge/license-MIT-green)

Full-stack e-commerce app: Next.js frontend and Django REST API with JWT auth, products, search, and cart.

- **Frontend**: `frontend/` – Next.js 15 (App Router), React 19, TypeScript
- **Backend**: `backend/` – Django REST API, MySQL, JWT, Google Cloud Storage for media

---

## Project structure (code references)

### Frontend (`frontend/`)

- **App router**: `app/layout.tsx` (root layout, Inter font, `ClientLayout`), `app/page.tsx` (home), `app/products/page.tsx`, `app/productdetails/page.tsx`, `app/aboutus/page.tsx`, `app/contact/page.tsx`. Auth routes under `app/(auth)/`: `layout.tsx` (3D GLB + `@react-three/fiber`), `login/page.tsx`, `register/page.tsx`.
- **API client**: Base URL is set in `api/auth.api.ts` as `API_URL = "http://localhost:8000"`. Authenticated requests use `api/index.ts` (axios instance with `withCredentials: true`, Bearer token from `useAuth.store`, and 401 interceptor that calls `refreshUserToken` and retries).
- **Auth**: `api/auth.api.ts` – `registerUser`, `loginUser`, `logoutUser`, `refreshUserToken` (POST to `/register/`, `/login/`, `/logout/`, `/refresh/`). State in `api/useAuth.store.ts` (Zustand: `user`, `accessToken`, `login`, `logout`, `refresh`). On app load, `ClientLayout.tsx` runs `refresh()` when there is no token to restore session from HTTP-only refresh cookie.
- **Cart**: `api/cart.api.ts` – `getCart()` (GET `/cart/`), `addToCart(product_id, quantity)` (POST `/cart/`), `removeFromCart(product_id)` (DELETE `/cart/remove/<id>/`). `api/useCartStore.ts` – Zustand store with persist; `fetchCart`, `addItem`, `removeItem`, `updateQuantity`, `getTotalPrice`, `getTotalItems`. Cart is refetched after login in `Header.tsx` via `fetchCart()`.
- **Products**: `components/Products.tsx` fetches list with `fetch(\`${API_URL}/products/\`)`; `components/ProductDetails.tsx` fetches one product with `fetch(\`${API_URL}/products/${productId}\`)`. Search in `components/Search.tsx` calls `fetch(\`${API_URL}/productsearch/?name=${query}\`)` with 400ms debounce.
- **UI**: Radix UI (checkbox, slider, toggle, toggle-group in `components/ui/`), Tailwind CSS, Framer Motion, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`. Auth layout uses `@react-three/fiber` and `@react-three/drei` with `useGLTF('/free_rtx_5090.glb')`.

### Backend (`backend/`)

- **Django project**: `renderxbackend/` – `settings.py`, `urls.py`. App: `users/` (models, views, serializers, urls wired in root `urls.py`).
- **Models** (`users/models.py`): Custom **User** (extends `AbstractUser`, `USERNAME_FIELD = "email"`, `email` unique, `avatar_url`, `role`, table `users`). **Product** (name, description, category, brand, price, stock, rating, image URL, created_at, updated_at, is_available; table `products`). **CartItem** (user FK, product FK, quantity, created_at, updated_at; table `cart_items`, `unique_together` on user + product).
- **API endpoints** (`renderxbackend/urls.py`): `POST /register/`, `POST /login/`, `POST /logout/`, `POST /refresh/` (function views in `users/views.py`). `GET|POST /products/` → `ProductListView`, `GET|PUT|DELETE /products/<id>/` → `ProductDetailView`, `GET /productsearch/?name=&category=&min_price=&max_price=` → `ProductSearchView`, `GET|POST /cart/` → `CartView`, `DELETE /cart/remove/<id>/` → `CartItemDeleteView`.
- **Auth**: JWT via `rest_framework_simplejwt`; access token in response body, refresh token in HTTP-only cookie (`refresh_token`). In `settings.py`: `ACCESS_TOKEN_LIFETIME` 15 min, `REFRESH_TOKEN_LIFETIME` 1 day; `JWTAuthentication`; CORS allows `http://localhost:3000` and `http://127.0.0.1:3000` with credentials.
- **Permissions**: Products – GET and search public, POST/PUT/DELETE require `IsAdminUser`. Cart – `IsAuthenticated` for all.
- **Database**: MySQL (`django.db.backends.mysql`), config from env: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`; optional SSL via `DB_CA_CERT_PATH`, `DB_CLIENT_CERT_PATH`, `DB_CLIENT_KEY_PATH` (see `settings.py`).
- **Media**: Google Cloud Storage (`storages.backends.gcloud.GoogleCloudStorage`), bucket from `GS_BUCKET_NAME` (default `renderxstorage`), credentials from `service-account.json` in backend root.

---

## Running the project

- **Backend**
  - From repo root: `cd backend`. Create venv, install Django and deps (e.g. `djangorestframework`, `djangorestframework-simplejwt`, `mysqlclient`, `django-cors-headers`, `django-storages`, `python-dotenv`, `google-auth`).
  - Set env: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`; optionally SSL and GCP vars. Place `service-account.json` for GCS if using uploads.
  - Run migrations: `python manage.py migrate`. Start server: `python manage.py runserver` (default http://localhost:8000).
- **Frontend**
  - From repo root: `cd frontend`. Install deps: `npm install`. Dev server: `npm run dev` (uses Turbopack; app at http://localhost:3000).

Ensure the backend is reachable at the URL defined in `frontend/api/auth.api.ts` (e.g. `http://localhost:8000`) or update `API_URL` accordingly.

---

## API summary (from backend code)

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

Detailed request/response examples: see `backend/README.md`.

---

## Screenshots

Place your UI and database screenshots below (e.g. in `docs/screenshots/` and link them here).

### UI

- Home / products / product detail / cart:
  - `![UI main](./docs/screenshots/ui-main.png)`
  - `![UI products](./docs/screenshots/ui-products.png)`
  - `![UI cart](./docs/screenshots/ui-cart.png)`

### Database

- Schema / ERD / tables (e.g. MySQL or admin):
  - `![DB schema](./docs/screenshots/db-schema.png)`
  - `![DB tables](./docs/screenshots/db-tables.png)`

---

## Tech stack (from repo)

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion, Zustand, axios, Three.js / react-three-fiber / drei, lucide-react.
- **Backend**: Django, Django REST Framework, Simple JWT, MySQL, django-cors-headers, django-storages (GCP), python-dotenv.
