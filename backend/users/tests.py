from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, CartItem

User = get_user_model()


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass123"))


class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            description="Test description",
            category="electronics",
            brand="TestBrand",
            price=99.99,
            stock=10,
            rating=4.5,
            image="https://example.com/image.jpg",
            is_available=True
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.price, 99.99)
        self.assertEqual(self.product.stock, 10)
        self.assertTrue(self.product.is_available)


class CartItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            category="electronics",
            price=99.99
        )
        self.cart_item = CartItem.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )

    def test_cart_item_creation(self):
        self.assertEqual(self.cart_item.user, self.user)
        self.assertEqual(self.cart_item.product, self.product)
        self.assertEqual(self.cart_item.quantity, 2)


class RegisterSerializerTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_valid_data(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }
        response = self.client.post("/register/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)

    def test_register_duplicate_email(self):
        User.objects.create_user(
            username="user1",
            email="existing@example.com",
            password="pass123"
        )
        data = {
            "username": "user2",
            "email": "existing@example.com",
            "password": "password123"
        }
        response = self.client.post("/register/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_login_valid_credentials(self):
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        response = self.client.post("/login/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("user", response.data)

    def test_login_invalid_password(self):
        data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post("/login/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product1 = Product.objects.create(
            name="Product 1",
            category="electronics",
            price=100.00
        )
        self.product2 = Product.objects.create(
            name="Product 2",
            category="clothing",
            price=50.00
        )

    def test_get_products_list(self):
        response = self.client.get("/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_product_authorized(self):
        admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="admin123",
            is_staff=True
        )
        self.client.force_authenticate(user=admin_user)
        
        data = {
            "name": "New Product",
            "category": "test",
            "price": 75.00
        }
        response = self.client.post("/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ProductDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product = Product.objects.create(
            name="Test Product",
            category="electronics",
            price=99.99,
            description="Test description"
        )

    def test_get_product_detail(self):
        response = self.client.get(f"/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Product")

    def test_delete_product_authorized(self):
        admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="admin123",
            is_staff=True
        )
        self.client.force_authenticate(user=admin_user)
        
        response = self.client.delete(f"/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())


class ProductSearchViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product1 = Product.objects.create(
            name="Laptop",
            category="electronics",
            price=1000.00
        )
        self.product2 = Product.objects.create(
            name="Phone",
            category="electronics",
            price=500.00
        )

    def test_search_by_name(self):
        response = self.client.get("/productsearch/", {"name": "Laptop"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Laptop")


class CartViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            category="electronics",
            price=99.99,
            is_available=True
        )
        self.client.force_authenticate(user=self.user)

    def test_add_to_cart(self):
        data = {"product_id": self.product.id, "quantity": 2}
        response = self.client.post("/cart/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["quantity"], 2)

    def test_get_cart_with_items(self):
        CartItem.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )
        
        response = self.client.get("/cart/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class CartItemDeleteViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.product = Product.objects.create(
            name="Test Product",
            category="electronics",
            price=99.99
        )
        self.cart_item = CartItem.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )
        self.client.force_authenticate(user=self.user)

    def test_delete_cart_item(self):
        response = self.client.delete(f"/cart/remove/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(CartItem.objects.filter(id=self.cart_item.id).exists())


class RefreshTokenTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_refresh_token_with_cookie(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies["refresh_token"] = str(refresh)
        
        response = self.client.post("/refresh/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
