import { products } from "../data/products.js";

const CART_KEY = "bakule_kembang_cart_v1";
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

// DEBOUNCE VARIABLE
let uiUpdateTimeout = null;

// ===== CORE FUNCTIONS =====
export function addToCart(productId, quantity = 1) {
  console.log(
    `🛒 [CART SERVICE] addToCart CALLED - ID: ${productId}, Qty: ${quantity}`
  );

  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error("❌ Product not found:", productId);
    return false;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    console.log(
      `📈 Updating quantity from ${existingItem.quantity} to ${
        existingItem.quantity + quantity
      }`
    );
    existingItem.quantity += quantity;
  } else {
    console.log(`🆕 Adding new item: ${product.name}`);
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category,
      flowerType: product.flowerType,
    });
  }

  saveCart();
  console.log(`💾 Cart saved. Total items: ${cart.length}`);

  debouncedUpdateCartUI();
  return true;
}

export function removeFromCart(productId) {
  const initialLength = cart.length;
  cart = cart.filter((item) => item.id !== productId);

  if (cart.length < initialLength) {
    saveCart();
    debouncedUpdateCartUI();
    return true;
  }
  return false;
}

export function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    return removeFromCart(productId);
  }

  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart();
    debouncedUpdateCartUI();
    return true;
  }
  return false;
}

export function clearCart() {
  cart = [];
  localStorage.removeItem(CART_KEY);
  debouncedUpdateCartUI();
  return true;
}

// ===== GETTER FUNCTIONS =====
export function getCart() {
  return [...cart];
}

export function getCartItem(productId) {
  return cart.find((item) => item.id === productId);
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function isInCart(productId) {
  return cart.some((item) => item.id === productId);
}

// ===== HELPER FUNCTIONS =====
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// DEBOUNCED UI UPDATE
function debouncedUpdateCartUI() {
  if (uiUpdateTimeout) {
    clearTimeout(uiUpdateTimeout);
  }

  uiUpdateTimeout = setTimeout(() => {
    updateCartUI();
  }, 10);
}

function updateCartUI() {
  const count = getCartCount();
  const cartCountEl = document.querySelectorAll(".cart-count");

  cartCountEl.forEach((el) => {
    if (el) {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";

      el.classList.add("pulse");
      setTimeout(() => el.classList.remove("pulse"), 300);
    }
  });

  // Dispatch single event
  window.dispatchEvent(
    new CustomEvent("cartUpdated", {
      detail: { items: getCart(), total: getCartTotal(), count },
    })
  );
}

export function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Initial update
updateCartUI();

export function removeMultipleFromCart(productIds) {
  const initialLength = cart.length;
  cart = cart.filter((item) => !productIds.includes(item.id));

  if (cart.length < initialLength) {
    saveCart();
    debouncedUpdateCartUI();
    return true;
  }
  return false;
}

export function getSelectedItemsTotal(selectedIds) {
  return cart
    .filter((item) => selectedIds.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemsByIds(ids) {
  return cart.filter((item) => ids.includes(item.id));
}
