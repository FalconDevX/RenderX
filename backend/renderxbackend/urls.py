from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("register/", views.register_user, name="register_user"),
    path("login/", views.login_user, name="login_user"),
    path("logout/", views.logout_user, name="logout_user"),
    path("refresh/", views.refresh_token, name="refresh_token"),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:product_id>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('productsearch/', views.ProductSearchView.as_view(), name='product-search'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/remove/<int:product_id>/', views.CartItemDeleteView.as_view(), name='cart-remove'),
]
