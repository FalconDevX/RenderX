import requests
import json

BASE_URL = "http://127.0.0.1:8000"

class TestE2E:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.test_user = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }
        self.test_product = {
            "name": "Test Product",
            "description": "Test description",
            "category": "electronics",
            "brand": "TestBrand",
            "price": "99.99",
            "stock": 10,
            "rating": 4.5,
            "image": "https://example.com/image.jpg",
            "is_available": True
        }

    def print_result(self, test_name, status, response=None):
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {test_name}")
        if response:
            print(f"   Status: {response.status_code}")
            if response.status_code >= 400:
                print(f"   Response: {response.text[:200]}")

    def test_register(self):
        print("\n=== Test: Rejestracja ===")
        response = self.session.post(
            f"{BASE_URL}/register/",
            json=self.test_user
        )
        success = response.status_code == 201
        self.print_result("Rejestracja użytkownika", success, response)
        return success

    def test_register_duplicate(self):
        print("\n=== Test: Rejestracja duplikatu ===")
        response = self.session.post(
            f"{BASE_URL}/register/",
            json=self.test_user
        )
        success = response.status_code == 400
        self.print_result("Rejestracja duplikatu (powinno zwrócić błąd)", success, response)
        return success

    def test_login(self):
        print("\n=== Test: Logowanie ===")
        response = self.session.post(
            f"{BASE_URL}/login/",
            json={
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
        )
        success = response.status_code == 200
        if success:
            data = response.json()
            self.access_token = data.get("access")
            print(f"   Token otrzymany: {self.access_token[:20]}...")
        self.print_result("Logowanie", success, response)
        return success

    def test_login_invalid(self):
        print("\n=== Test: Logowanie z błędnymi danymi ===")
        response = self.session.post(
            f"{BASE_URL}/login/",
            json={
                "email": self.test_user["email"],
                "password": "wrongpassword"
            }
        )
        success = response.status_code == 400
        self.print_result("Logowanie z błędnym hasłem", success, response)
        return success

    def test_refresh_token(self):
        print("\n=== Test: Odświeżenie tokena ===")
        response = self.session.post(f"{BASE_URL}/refresh/")
        success = response.status_code == 200
        if success:
            data = response.json()
            self.access_token = data.get("access")
            print(f"   Nowy token: {self.access_token[:20]}...")
        self.print_result("Odświeżenie tokena", success, response)
        return success

    def test_get_products(self):
        print("\n=== Test: Lista produktów ===")
        response = requests.get(f"{BASE_URL}/products/")
        success = response.status_code == 200
        if success:
            products = response.json()
            print(f"   Liczba produktów: {len(products)}")
        self.print_result("Pobranie listy produktów", success, response)
        return success

    def test_get_product_detail(self):
        print("\n=== Test: Szczegóły produktu ===")
        response = requests.get(f"{BASE_URL}/products/1/")
        success = response.status_code == 200
        self.print_result("Pobranie szczegółów produktu", success, response)
        return success

    def test_search_products(self):
        print("\n=== Test: Wyszukiwanie produktów ===")
        params = {"name": "test", "category": "electronics"}
        response = requests.get(f"{BASE_URL}/productsearch/", params=params)
        success = response.status_code == 200
        if success:
            products = response.json()
            print(f"   Znaleziono produktów: {len(products)}")
        self.print_result("Wyszukiwanie produktów", success, response)
        return success

    def test_cart_add(self):
        print("\n=== Test: Dodanie do koszyka ===")
        if not self.access_token:
            print("   ⚠️  Brak tokena, pomijam test")
            return False
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.post(
            f"{BASE_URL}/cart/",
            json={"product_id": 1, "quantity": 2},
            headers=headers
        )
        success = response.status_code in [200, 201]
        self.print_result("Dodanie produktu do koszyka", success, response)
        return success

    def test_cart_get(self):
        print("\n=== Test: Pobranie koszyka ===")
        if not self.access_token:
            print("   ⚠️  Brak tokena, pomijam test")
            return False
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(f"{BASE_URL}/cart/", headers=headers)
        success = response.status_code == 200
        if success:
            cart = response.json()
            print(f"   Produktów w koszyku: {len(cart)}")
        self.print_result("Pobranie koszyka", success, response)
        return success

    def test_cart_remove(self):
        print("\n=== Test: Usunięcie z koszyka ===")
        if not self.access_token:
            print("   ⚠️  Brak tokena, pomijam test")
            return False
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.delete(
            f"{BASE_URL}/cart/remove/1/",
            headers=headers
        )
        success = response.status_code in [200, 404]
        self.print_result("Usunięcie produktu z koszyka", success, response)
        return success

    def test_cart_unauthorized(self):
        print("\n=== Test: Koszyk bez autoryzacji ===")
        response = requests.get(f"{BASE_URL}/cart/")
        success = response.status_code == 401
        self.print_result("Koszyk bez tokena (powinno zwrócić 401)", success, response)
        return success

    def test_logout(self):
        print("\n=== Test: Wylogowanie ===")
        response = self.session.post(f"{BASE_URL}/logout/")
        success = response.status_code == 200
        self.print_result("Wylogowanie", success, response)
        return success

    def run_all(self):
        print("=" * 50)
        print("Uruchamianie testów e2e")
        print("=" * 50)
        
        results = []
        
        results.append(("Rejestracja", self.test_register()))
        results.append(("Rejestracja duplikatu", self.test_register_duplicate()))
        results.append(("Logowanie", self.test_login()))
        results.append(("Logowanie z błędnymi danymi", self.test_login_invalid()))
        results.append(("Odświeżenie tokena", self.test_refresh_token()))
        results.append(("Lista produktów", self.test_get_products()))
        results.append(("Szczegóły produktu", self.test_get_product_detail()))
        results.append(("Wyszukiwanie produktów", self.test_search_products()))
        results.append(("Koszyk bez autoryzacji", self.test_cart_unauthorized()))
        results.append(("Dodanie do koszyka", self.test_cart_add()))
        results.append(("Pobranie koszyka", self.test_cart_get()))
        results.append(("Usunięcie z koszyka", self.test_cart_remove()))
        results.append(("Wylogowanie", self.test_logout()))
        
        print("\n" + "=" * 50)
        print("Podsumowanie testów")
        print("=" * 50)
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} - {name}")
        
        print(f"\nWynik: {passed}/{total} testów przeszło")
        print("=" * 50)
        
        return passed == total

if __name__ == "__main__":
    tester = TestE2E()
    tester.run_all()
