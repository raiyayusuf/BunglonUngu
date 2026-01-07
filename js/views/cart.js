import { deleteModal } from "../components/modal.js";
console.log("🔄 Modal imported:", deleteModal);

import {
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
  formatPrice,
} from "../services/cart-service.js";
import { navigateTo } from "../router.js";

// FLAG UNTUK TRACK INITIALIZATION
let cartPageInitialized = false;

export function loadCartPage() {
  console.log("🛒 Loading cart page...");

  const app = document.getElementById("app");

  // Clear loading state nek ono
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";

  const items = getCart();
  const total = getCartTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Render langsung ke DOM
  app.innerHTML = `
    <div class="cart-page" id="cart-page-container">
      ${renderHeader(itemCount)}
      ${
        items.length === 0 ? renderEmptyCart() : renderCartContent(items, total)
      }
    </div>
  `;

  // Initialize events setelah DOM siap
  setTimeout(() => {
    if (cartPageInitialized) {
      cleanupCartPage();
    }
    initializeCartPage();
  }, 0);
}

// ===== CLEANUP FUNCTION =====
function cleanupCartPage() {
  const container = document.getElementById("cart-page-container");
  if (!container) return;

  // Remove event listeners dengan cara replace element
  if (container._cartPageClickHandler) {
    container.removeEventListener("click", container._cartPageClickHandler);
    delete container._cartPageClickHandler;
  }

  // Remove specific button listeners
  const buttons = [
    "browse-products",
    "clear-cart",
    "checkout-btn",
    "checkout-mobile",
  ];
  buttons.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    }
  });

  console.log("🧹 Cart page cleaned up");
}

// ===== RENDER FUNCTIONS =====
function renderHeader(itemCount) {
  return `
    <div class="page-header">
      <h1><i class="fas fa-shopping-cart"></i> Keranjang Belanja</h1>
      <p>Review ${itemCount} produk dalam keranjang Anda</p>
    </div>
  `;
}

function renderEmptyCart() {
  return `
    <div class="empty-cart-page">
      <div class="empty-cart-illustration">
        <i class="fas fa-shopping-cart fa-4x"></i>
      </div>
      <h2>Keranjang Anda Kosong</h2>
      <p>Tambahkan produk bunga favorit Anda ke keranjang belanja</p>
      <div class="empty-cart-actions">
        <button class="btn btn-primary" id="browse-products">
          <i class="fas fa-store"></i> Jelajahi Produk
        </button>
        <button class="btn btn-outline" id="go-back">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
      </div>
    </div>
  `;
}

function renderCartContent(items, total) {
  return `
    <div class="cart-content">
      <div class="cart-items-section">
        <div class="section-header">
          <h3>Produk dalam Keranjang (${items.length} item)</h3>
          <button class="btn btn-text" id="clear-cart">
            <i class="fas fa-trash"></i> Kosongkan Keranjang
          </button>
        </div>
        
        <div class="cart-items-list">
          ${items.map((item) => renderCartItem(item)).join("")}
        </div>
      </div>
      
      <div class="cart-summary-section">
        <div class="summary-card">
          <h3>Ringkasan Belanja</h3>
          
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal (${items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )} produk)</span>
              <span>${formatPrice(total)}</span>
            </div>
            <div class="summary-row">
              <span>Pengiriman</span>
              <span class="free-shipping">Gratis</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <strong>Total Pembayaran</strong>
              <strong class="total-price">${formatPrice(total)}</strong>
            </div>
          </div>
          
          <button class="btn btn-primary btn-block" id="checkout-btn">
            <i class="fas fa-credit-card"></i> Lanjut ke Checkout
          </button>
          
          <div class="payment-methods">
            <p class="payment-label">Metode Pembayaran:</p>
            <div class="payment-icons">
              <i class="fab fa-cc-visa" title="Visa"></i>
              <i class="fab fa-cc-mastercard" title="Mastercard"></i>
              <i class="fab fa-cc-paypal" title="PayPal"></i>
              <i class="fas fa-university" title="Transfer Bank"></i>
            </div>
          </div>
        </div>
        
        <div class="cart-actions-mobile">
          <button class="btn btn-primary btn-block" id="checkout-mobile">
            <i class="fas fa-credit-card"></i> Checkout ${formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCartItem(item) {
  return `
    <div class="cart-item-card" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      
      <div class="cart-item-info">
        <h4 class="item-title">${item.name}</h4>
        <p class="item-category">${getCategoryName(
          item.category
        )} • ${getFlowerTypeName(item.flowerType)}</p>
        <div class="item-price">${formatPrice(item.price)} per item</div>
        
        <div class="item-controls">
          <div class="quantity-control">
            <button class="qty-btn minus" data-action="minus" data-id="${
              item.id
            }">
              <i class="fas fa-minus"></i>
            </button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn plus" data-action="plus" data-id="${
              item.id
            }">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          
          <button class="btn btn-text remove-btn" data-action="remove" data-id="${
            item.id
          }">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
      
      <div class="cart-item-subtotal">
        <div class="subtotal-label">Subtotal</div>
        <div class="subtotal-amount">${formatPrice(
          item.price * item.quantity
        )}</div>
      </div>
    </div>
  `;
}

// ===== HELPER FUNCTIONS =====
function getCategoryName(categoryId) {
  const categories = {
    bouquet: "Buket",
    bunch: "Bunch",
    bag: "Tas",
  };
  return categories[categoryId] || categoryId;
}

function getFlowerTypeName(flowerType) {
  const types = {
    rose: "Mawar",
    tulip: "Tulip",
    gerbera: "Gerbera",
    hydrangea: "Hydrangea",
    mixed: "Campuran",
  };
  return types[flowerType] || flowerType;
}

// ===== EVENT HANDLERS =====
export function initializeCartPage() {
  console.log("🛒 Initializing cart page events...");

  const container = document.getElementById("cart-page-container");
  if (!container) {
    console.error("❌ Cart page container not found!");
    return;
  }

  // SINGLE EVENT DELEGATION FOR ALL CART ACTIONS
  const cartPageClickHandler = function (e) {
    const button = e.target.closest("[data-action]");
    if (!button || !button.dataset.id) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const productId = parseInt(button.dataset.id);
    const action = button.dataset.action;
    const items = getCart();
    const item = items.find((i) => i.id === productId);

    if (!item) return;

    console.log(`📱 Cart page action: ${action} for product ${productId}`);

    switch (action) {
      case "minus":
        if (item.quantity > 1) {
          updateQuantity(productId, item.quantity - 1);
          refreshCartPage();
        } else {
          deleteModal.open(() => {
            removeFromCart(productId);
            refreshCartPage();
          });
        }
        break;

      case "plus":
        updateQuantity(productId, item.quantity + 1);
        refreshCartPage();
        break;

      case "remove":
        deleteModal.open(() => {
          removeFromCart(productId);
          refreshCartPage();
        });
        break;
    }
  };

  // Attach the single handler
  container._cartPageClickHandler = cartPageClickHandler;
  container.addEventListener("click", cartPageClickHandler);

  // ===== SPECIFIC BUTTON HANDLERS =====

  // BROWSE PRODUCTS BUTTON
  const browseBtn = document.getElementById("browse-products");
  if (browseBtn) {
    browseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      navigateTo("#products");
    });
  }

  // GO BACK BUTTON
  const goBackBtn = document.getElementById("go-back");
  if (goBackBtn) {
    goBackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.history.back();
    });
  }

  // CLEAR CART BUTTON
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      deleteModal.open(() => {
        clearCart();
        refreshCartPage();
      });
    });
  }

  // CHECKOUT BUTTONS
  const checkoutHandler = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (getCart().length === 0) {
      alert("Keranjang Anda kosong. Tambahkan produk terlebih dahulu.");
      return;
    }
    alert(
      "Checkout functionality akan segera hadir! Total: " +
        formatPrice(getCartTotal())
    );
  };

  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutMobile = document.getElementById("checkout-mobile");

  if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutHandler);
  if (checkoutMobile) checkoutMobile.addEventListener("click", checkoutHandler);

  // FLAG AS INITIALIZED
  cartPageInitialized = true;

  console.log("✅ Cart page events initialized");
}

// REFRESH FUNCTION (tanpa re-initialize berlebihan)
function refreshCartPage() {
  if (window.location.hash === "#cart") {
    // Debounce refresh untuk hindari multiple render
    if (window._refreshTimeout) clearTimeout(window._refreshTimeout);

    window._refreshTimeout = setTimeout(() => {
      loadCartPage();
    }, 50);
  }
}

// Export untuk external refresh
export function refreshCartPageIfActive() {
  if (window.location.hash === "#cart") {
    refreshCartPage();
  }
}
