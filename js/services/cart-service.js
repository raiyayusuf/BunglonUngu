import { products } from "../data/products.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return false;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  return true;
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

export function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? "flex" : "none";
  }
}

export function getCart() {
  return [...cart];
}

export function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Initialize cart count on load
document.addEventListener("DOMContentLoaded", updateCartCount);
