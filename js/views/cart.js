import { deleteModal } from "../components/modal.js";
import { closeCartSidebar } from "../components/cart-sidebar.js";

import {
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
  formatPrice,
  removeMultipleFromCart, // 🔥 TAMBAH INI UNTUK BULK DELETE
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
          <div class="select-all-container">
            <label class="cart-checkbox">
              <input type="checkbox" id="select-all-checkbox">
              <span class="checkmark"></span>
              Pilih Semua
            </label>
          </div>
          <button class="btn btn-text" id="clear-cart">
            <i class="fas fa-trash"></i> Kosongkan Keranjang
          </button>
        </div>
        
        <div class="cart-items-list">
          ${items.map((item) => renderCartItem(item)).join("")}
        </div>
      </div>
      
      <div class="cart-summary-section">
        ${renderSummaryCard(items, total)}
      </div>
    </div>
    
    <!-- BULK ACTIONS BAR (Hidden by default) -->
    <div class="bulk-actions-bar" id="bulk-actions-bar" style="display: none;">
      <div class="bulk-actions-info">
        <span id="selected-count">0</span> produk dipilih
        <span class="bulk-total" id="bulk-total">Rp 0</span>
      </div>
      <div class="bulk-actions-buttons">
        <button class="btn btn-outline" id="bulk-deselect">
          <i class="fas fa-times"></i> Batalkan
        </button>
        <button class="btn btn-danger" id="bulk-delete">
          <i class="fas fa-trash"></i> Hapus yang Dipilih
        </button>
        <button class="btn btn-primary" id="bulk-checkout">
          <i class="fas fa-shopping-cart"></i> Checkout Selected
        </button>
      </div>
    </div>
  `;
}

function renderSummaryCard(items, total) {
  return `
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
  `;
}

function renderCartItem(item) {
  return `
    <div class="cart-item-card" data-id="${item.id}">
      <!-- CHECKBOX BARU DI SINI -->
      <div class="cart-item-checkbox">
        <label class="cart-checkbox">
          <input type="checkbox" class="item-checkbox" data-id="${item.id}">
          <span class="checkmark"></span>
        </label>
      </div>
      
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
    if (typeof closeCartSidebar === "function") {
      closeCartSidebar();
    }
    navigateTo("#checkout");
  };

  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutMobile = document.getElementById("checkout-mobile");

  if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutHandler);
  if (checkoutMobile) checkoutMobile.addEventListener("click", checkoutHandler);

  // ===== SETUP BULK ACTIONS =====
  setTimeout(() => {
    setupBulkActions();
    console.log("✅ Bulk actions initialized");
  }, 100);

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

// ===== BULK ACTIONS LOGIC =====
function setupBulkActions() {
  const container = document.getElementById("cart-page-container");
  if (!container) return;

  // 1. CHECKBOX CHANGE HANDLER
  container.addEventListener("change", function (e) {
    if (
      e.target.classList.contains("item-checkbox") ||
      e.target.id === "select-all-checkbox"
    ) {
      updateBulkActionsUI();
    }
  });

  // 2. SELECT ALL CHECKBOX
  const selectAllCheckbox = document.getElementById("select-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function (e) {
      const itemCheckboxes = document.querySelectorAll(".item-checkbox");
      const isChecked = e.target.checked;

      itemCheckboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });

      updateBulkActionsUI();
    });
  }

  // 3. BULK DESELECT BUTTON
  const bulkDeselectBtn = document.getElementById("bulk-deselect");
  if (bulkDeselectBtn) {
    bulkDeselectBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Uncheck semua checkbox
      document.querySelectorAll(".item-checkbox").forEach((checkbox) => {
        checkbox.checked = false;
      });

      const selectAll = document.getElementById("select-all-checkbox");
      if (selectAll) selectAll.checked = false;

      updateBulkActionsUI();
    });
  }

  // 4. BULK DELETE BUTTON
  const bulkDeleteBtn = document.getElementById("bulk-delete");
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedIds = getSelectedItemIds();
      if (selectedIds.length === 0) return;

      // PAKAI MODAL YANG UDAH ADA
      deleteModal.open(() => {
        // ✅ FIXED: Langsung pake fungsi yang udah di-import
        removeMultipleFromCart(selectedIds);
        refreshCartPage();
      }, `Hapus ${selectedIds.length} produk dari keranjang?`);
    });
  }

  // 5. BULK CHECKOUT BUTTON
  const bulkCheckoutBtn = document.getElementById("bulk-checkout");
  if (bulkCheckoutBtn) {
    bulkCheckoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedIds = getSelectedItemIds();
      if (selectedIds.length === 0) return;

      // Logika checkout selected items
      alert(
        `Checkout ${selectedIds.length} produk yang dipilih! Fitur lanjutan akan segera hadir.`
      );
      // TODO: Implement checkout selected items
    });
  }
}

// Helper: Get semua ID yang dipilih
function getSelectedItemIds() {
  const checkboxes = document.querySelectorAll(".item-checkbox:checked");
  return Array.from(checkboxes).map((cb) => parseInt(cb.dataset.id));
}

// Helper: Update bulk actions UI
function updateBulkActionsUI() {
  const selectedIds = getSelectedItemIds();
  const selectedCount = selectedIds.length;
  const bulkBar = document.getElementById("bulk-actions-bar");

  if (selectedCount > 0) {
    // Show bulk actions bar
    bulkBar.style.display = "flex";

    // Update counter
    document.getElementById("selected-count").textContent = selectedCount;

    // Calculate total for selected items
    const selectedTotal = getSelectedItemsTotal(selectedIds);
    document.getElementById("bulk-total").textContent =
      formatPrice(selectedTotal);

    // Update select all checkbox state
    const itemCheckboxes = document.querySelectorAll(".item-checkbox");
    const allChecked = itemCheckboxes.length === selectedCount;
    const selectAll = document.getElementById("select-all-checkbox");
    if (selectAll) {
      selectAll.checked = allChecked;
      selectAll.indeterminate = selectedCount > 0 && !allChecked;
    }
  } else {
    // Hide bulk actions bar
    bulkBar.style.display = "none";

    // Reset select all
    const selectAll = document.getElementById("select-all-checkbox");
    if (selectAll) {
      selectAll.checked = false;
      selectAll.indeterminate = false;
    }
  }
}

// Helper: Get total for selected items
function getSelectedItemsTotal(selectedIds) {
  const items = getCart();
  return items
    .filter((item) => selectedIds.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);
}

// Export untuk external refresh
export function refreshCartPageIfActive() {
  if (window.location.hash === "#cart") {
    refreshCartPage();
  }
}
