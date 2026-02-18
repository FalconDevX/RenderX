from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar_url = models.CharField(max_length=255, blank=True, null=True, default="")
    role = models.CharField(max_length=5, default="user")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username
    
    class Meta:
        db_table = "users"

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank = True)
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50, blank = True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0.0)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'products'
        managed = True
        
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name} (x{self.quantity})"

    class Meta:
        db_table = 'cart_items'
        managed = True
        unique_together = ('user', 'product')