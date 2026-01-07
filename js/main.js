import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { router } from "./router.js";
import { renderCartSidebar } from "./components/cart-sidebar.js";
import { deleteModal } from "./components/modal.js";

let currentPage = null;

function initApp() {
  console.log("🌺 Bakule Kembang Initializing...");

  // 1. Render navbar dan footer
  renderNavbar();
  renderFooter();

  // 2. Clean duplicate sidebar (if any)
  document.querySelectorAll("#cart-sidebar").forEach((sidebar) => {
    sidebar.remove();
  });

  // 3. Render cart sidebar
  const cartSidebar = renderCartSidebar();
  document.body.appendChild(cartSidebar);
  console.log("🛒 Cart sidebar rendered");

  // 🔥 4. CRITICAL FIX: Initialize cart badge on app start
  initializeCartBadge();

  // 5. Setup router event listeners
  setupRouter();

  // 6. Hide loading immediately
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }

  // 7. CALL ROUTER FOR INITIAL PAGE
  console.log("📍 Initial route check...");
  router();

  console.log("✅ Application started");
}

// 🔥 NEW FUNCTION: Initialize cart badge from localStorage
function initializeCartBadge() {
  console.log("🛒 Initializing cart badge from localStorage...");

  // Trigger cartUpdated event to refresh all UI components
  window.dispatchEvent(new CustomEvent("cartUpdated"));

  // Alternatively, directly update the count if needed
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const cart =
      JSON.parse(localStorage.getItem("bakule_kembang_cart_v1")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
    console.log(`🛒 Cart badge initialized with ${totalItems} items`);
  }
}

function setupRouter() {
  window.addEventListener("hashchange", router);
  window.addEventListener("popstate", router);
}

// akses router e cah
export function setCurrentPage() {
  currentPage = page;
}

export function getCurrentPage() {
  return currentPage;
}

// mulai app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
