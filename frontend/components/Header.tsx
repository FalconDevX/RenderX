"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogIn, EditIcon, LogOut, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/useAuth.store";
import { useCartStore } from "@/api/useCartStore";

const Header = () => {
  const router = useRouter();
  const { user, logout, accessToken } = useAuth();
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, fetchCart } = useCartStore();
  const lastUserIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    const currentUserId = user?.email || null;
    
    if (user && accessToken && lastUserIdRef.current !== currentUserId) {
      lastUserIdRef.current = currentUserId;
      fetchCart().catch(() => {
      });
    } else if (!user) {
      lastUserIdRef.current = null;
      useCartStore.getState().clearCart();
    }
  }, [user, accessToken, fetchCart]);
  
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserPanelOpen(false);
    router.push("/");
  };

  return (
    <header className="w-full bg-[#16181C] backdrop-blur-md border-b border-white/10">
      <div className="w-full md:flex-start h-20 flex justify-between items-center px-12 sm:px-16 md:px-24">
        <div
          className="w-1/3 hidden md:flex items-center gap-3 flex-shrink-0 transition-all duration-300"
          onClick={() => router.push("/")}
        >
          <Image
            src="/renderx-logo.png"
            alt="BitStorage"
            width={100}
            height={100}
            className="rounded-md cursor-pointer"
          />
        </div>

        <nav className="w-1/3 flex justify-center flex-grow gap-8 text-[#9CA3AF] font-light">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-white transition-colors duration-300"
          >
            Products
          </Link>
          <Link
            href="/aboutus"
            className="hover:text-white transition-colors duration-300 whitespace-nowrap"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition-colors duration-300"
          >
            Contact
          </Link>
        </nav>

        <div className="w-1/3 flex justify-end items-center gap-4 relative">
          {user && (
            <p className="flex items-center justify-center gap-2 text-white px-4 py-2  text-center">
              {user.username}
            </p>
          )}
          <div
            className="w-[30px] h-[30px] rounded-md cursor-pointer relative"
            onClick={handleCartToggle}
          >
            <ShoppingCart className="w-full h-full text-[#9CA3AF] hover:text-white transition-colors duration-300" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <div
            className="w-[30px] h-[30px] rounded-md cursor-pointer"
            onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}
          >
            <User className="w-full h-full text-[#9CA3AF] hover:text-white transition-colors duration-300" />
          </div>

          {isCartOpen && (
            <div className="absolute right-0 top-10 w-96 bg-[#1E2025] rounded-md shadow-lg transition-all duration-300 overflow-hidden z-100 max-h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white text-lg font-semibold">Shopping Cart</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="p-4 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-700 last:border-0">
                        <Image
                          src={item.image || "/placeholder_graphiccard.png"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover bg-gray-800"
                        />
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium">{item.name}</h4>
                          <p className="text-orange-500 text-sm mt-1">{item.price} zł</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-xs cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-xs cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="ml-auto text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {items.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white text-lg font-semibold">{getTotalPrice().toFixed(2)} zł</span>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => {
                      setIsCartOpen(false);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          )}
          {isUserPanelOpen && (
            <div className="absolute right-0 top-10 w-40 bg-[#1E2025] rounded-md shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-center z-50">
              {user ? (
                <>
                  {/* <p className="flex items-center justify-center gap-2 text-white px-4 py-2 hover:bg-white/10 cursor-pointer w-full text-center border-b border-gray-500">
                    Zalogowano jako {user.username}
                  </p> */}
                  <p
                    className="flex items-center justify-center gap-2 text-white px-4 py-2 hover:bg-white/10 cursor-pointer w-full text-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="flex items-center justify-center gap-2 text-white px-4 py-2 hover:bg-white/10 cursor-pointer w-full text-center border-b border-gray-500"
                    onClick={() => router.push("/login")}
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </p>
                  <p
                    className="flex items-center justify-center gap-2 text-white px-4 py-2 hover:bg-white/10 cursor-pointer w-full text-center"
                    onClick={() => router.push("/register")}
                  >
                    <EditIcon className="w-5 h-5 " /> Register
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
