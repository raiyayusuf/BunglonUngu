import { deleteModal } from "../components/modal.js";

import {
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
  formatPrice,
} from "../services/cart-service.js";
import { navigateTo } from "../router.js";

// SIMPAN REFERENCE UNTUK CLEANUP
let currentCartEventListeners = new Map();

export function renderCartSidebar() {
  console.log("🛒 Rendering cart sidebar...");

  const sidebar = document.createElement("aside");
  sidebar.className = "cart-sidebar";
  sidebar.id = "cart-sidebar";

  updateSidebarContent(sidebar);

  window.addEventListener("cartUpdated", () => {
    console.log("🔄 Cart updated event received in sidebar");
    updateSidebarContent(sidebar);
  });

  return sidebar;
}

export function updateSidebarContent(container) {
  console.log("🔄 Updating sidebar content...");

  // CLEANUP EVENT LISTENERS SEBELUMNYA
  if (currentCartEventListeners.has(container)) {
    const { overlayClickHandler } = currentCartEventListeners.get(container);
    const overlay = document.querySelector(".cart-overlay");
    if (overlay && overlayClickHandler) {
      overlay.removeEventListener("click", overlayClickHandler);
    }
    currentCartEventListeners.delete(container);
  }

  // AMBIL DATA TERBARU
  const items = getCart();
  const total = getCartTotal();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log("📦 Cart items:", items.length, "Total:", total);

  // RENDER BARU
  container.innerHTML = `
    <div class="cart-sidebar-header">
      <h3>
        <i class="fas fa-shopping-cart"></i>
        Keranjang Belanja
        <span class="cart-count-badge">${count}</span>
      </h3>
      <button class="close-cart-btn" id="close-cart" aria-label="Tutup keranjang">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="cart-sidebar-body">
      ${items.length === 0 ? renderEmptyCart() : renderCartItems(items)}
    </div>
    
    ${items.length > 0 ? renderCartFooter(total) : ""}
  `;

  // ATTACH EVENT LISTENERS YANG BARU
  attachSidebarEvents(container);
  console.log("✅ Sidebar content updated");
}

function renderEmptyCart() {
  return `
    <div class="empty-cart">
      <i class="fas fa-shopping-cart fa-3x"></i>
      <h4>Keranjang Kosong</h4>
      <p>Tambahkan produk ke keranjang untuk memulai belanja</p>
      <button class="btn btn-primary" id="continue-shopping">
        <i class="fas fa-store"></i> Lanjut Belanja
      </button>
    </div>
  `;
}

function renderCartItems(items) {
  return `
    <div class="cart-items">
      ${items
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
            <div class="cart-item-controls">
              <button class="quantity-btn minus" data-id="${
                item.id
              }" data-action="minus" aria-label="Kurangi jumlah">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${
                item.id
              }" data-action="plus" aria-label="Tambah jumlah">
                <i class="fas fa-plus"></i>
              </button>
              <button class="remove-item-btn" data-id="${
                item.id
              }" data-action="remove" aria-label="Hapus produk">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="cart-item-subtotal">
            ${formatPrice(item.price * item.quantity)}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderCartFooter(total) {
  return `
    <div class="cart-sidebar-footer">
      <div class="cart-summary">
        <div class="summary-row">
          <span>Total:</span>
          <strong class="cart-total">${formatPrice(total)}</strong>
        </div>
      </div>
      <div class="cart-actions">
        <button class="btn btn-outline" id="view-cart-page">
          <i class="fas fa-eye"></i> Lihat Detail
        </button>
        <button class="btn btn-primary" id="checkout-btn">
          <i class="fas fa-credit-card"></i> Checkout
        </button>
      </div>
    </div>
  `;
}

function attachSidebarEvents(container) {
  console.log("🔧 Attaching sidebar events...");

  // ===== 1. CLOSE BUTTON =====
  const closeBtn = container.querySelector("#close-cart");
  if (closeBtn) {
    // Remove existing listeners dulu
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCloseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log("✅ CLOSE BUTTON CLICKED!");
      closeCartSidebar();
    });
  }

  // ===== 2. CONTINUE SHOPPING BUTTON =====
  const continueBtn = container.querySelector("#continue-shopping");
  if (continueBtn) {
    const newContinueBtn = continueBtn.cloneNode(true);
    continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);

    newContinueBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeCartSidebar();
      navigateTo("#products");
    });
  }

  // ===== 3. VIEW CART PAGE BUTTON =====
  const viewCartBtn = container.querySelector("#view-cart-page");
  if (viewCartBtn) {
    const newViewCartBtn = viewCartBtn.cloneNode(true);
    viewCartBtn.parentNode.replaceChild(newViewCartBtn, viewCartBtn);

    newViewCartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeCartSidebar();
      navigateTo("#cart");
    });
  }

  // ===== 4. CHECKOUT BUTTON =====
  const checkoutBtn = container.querySelector("#checkout-btn");
  if (checkoutBtn) {
    const newCheckoutBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);

    newCheckoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const currentItems = getCart();
      if (currentItems.length === 0) {
        alert("Keranjang kosong! Tambahkan produk terlebih dahulu.");
        return;
      }
      closeCartSidebar();
      navigateTo("#checkout");
    });
  }

  // ===== 5. SINGLE EVENT DELEGATION HANDLER =====
  // Hapus handler lama jika ada
  if (container._cartItemClickHandler) {
    container.removeEventListener("click", container._cartItemClickHandler);
  }

  // Buat handler baru
  const cartItemClickHandler = function (e) {
    // Cari button yang diklik
    const button = e.target.closest("[data-action]");
    if (!button || !button.dataset.id) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const productId = parseInt(button.dataset.id);
    const action = button.dataset.action;
    const items = getCart();
    const item = items.find((i) => i.id === productId);

    if (!item) return;

    console.log(`🛒 Cart action: ${action} for product ${productId}`);

    switch (action) {
      case "minus":
        if (item.quantity > 1) {
          updateQuantity(productId, item.quantity - 1);
        } else {
          deleteModal.open(() => {
            removeFromCart(productId);
          });
        }
        break;

      case "plus":
        updateQuantity(productId, item.quantity + 1);
        break;

      case "remove":
        console.log("🔄 Opening delete modal...");
        console.log("Modal instance:", deleteModal);
        console.log("Modal initialized:", deleteModal.isInitialized);

        // Force re-init jika perlu
        if (!deleteModal.isInitialized) {
          deleteModal.init();
        }

        deleteModal.open(() => {
          console.log("✅ Delete callback executed!");
          removeFromCart(productId);
        }, "Hapus produk ini dari keranjang?");
        break;
    }
  };

  // Attach handler
  container._cartItemClickHandler = cartItemClickHandler;
  container.addEventListener("click", cartItemClickHandler);

  // ===== 6. OVERLAY HANDLER =====
  const overlayClickHandler = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    closeCartSidebar();
  };

  // Simpan reference untuk cleanup
  currentCartEventListeners.set(container, { overlayClickHandler });

  console.log("✅ All sidebar events attached successfully");
}

export function toggleCartSidebar() {
  const sidebar = document.getElementById("cart-sidebar");
  if (!sidebar) return;

  console.log("🛒 Toggling sidebar...");

  const isActive = sidebar.classList.contains("active");
  const overlay =
    document.querySelector(".cart-overlay") || createCartOverlay();

  if (!isActive) {
    // OPEN - Update content terlebih dahulu
    updateSidebarContent(sidebar);
    sidebar.classList.add("active");
    sidebar.style.right = "0";
    overlay.classList.add("active");

    // Attach overlay click handler
    const overlayClickHandler = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeCartSidebar();
    };

    overlay.addEventListener("click", overlayClickHandler);

    // Simpan untuk cleanup
    if (currentCartEventListeners.has(sidebar)) {
      const data = currentCartEventListeners.get(sidebar);
      data.overlayClickHandler = overlayClickHandler;
    }
  } else {
    // CLOSE
    closeCartSidebar();
  }
}

export function closeCartSidebar() {
  console.log("🛒 Closing cart sidebar PROPERLY");

  const sidebar = document.getElementById("cart-sidebar");
  if (!sidebar) {
    console.error("❌ Sidebar not found!");
    return;
  }

  // 1. Remove active class
  sidebar.classList.remove("active");

  // 2. FORCE CSS right position
  sidebar.style.right = "-400px";
  sidebar.style.transition = "right 0.3s ease";

  // 3. Handle overlay
  const overlay = document.querySelector(".cart-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";

    // Remove overlay setelah animasi selesai
    setTimeout(() => {
      if (overlay && !overlay.classList.contains("active")) {
        overlay.remove();
      }
    }, 300);
  }

  console.log("✅ Cart sidebar closed");
}

function createCartOverlay() {
  console.log("🛒 Creating cart overlay...");

  const oldOverlay = document.querySelector(".cart-overlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";

  document.body.appendChild(overlay);
  console.log("✅ Overlay created");
  return overlay;
}
