import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { router } from "./router.js";
import { renderCartSidebar } from "./components/cart-sidebar.js";
// import { getFeaturedProducts } from "../data/products.js";
// import { getRecentTestimonials } from "../data/testimonials.js";

// global state
let currentPage = null;

// application
// function initApp() {
//   console.log("Bakule Kembang Initializing...");

//   renderNavbar();
//   renderFooter();

//   const cartSidebar = renderCartSidebar();
//   document.body.appendChild(cartSidebar);
//   console.log(
//     "🛒 Cart sidebar in DOM:",
//     document.getElementById("cart-sidebar")
//   );

//   setupRouter();

//   setTimeout(() => {
//     const loading = document.getElementById("loading");
//     if (loading) {
//       loading.style.opacity = "0";
//       setTimeout(() => {
//         loading.style.display = "none";
//         // PENTINGGGG===========
//         router();
//       }, 500);
//     }
//   }, 1000); // loading time nya
//   console.log("Application started✅");
// }

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

  // 4. Setup router event listeners
  setupRouter();

  // 5. Hide loading immediately
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }

  // 6. CALL ROUTER FOR INITIAL PAGE - ini yang penting!
  console.log("📍 Initial route check...");
  router(); // ← PANGGIL ROUTER() LANGSUNG!

  console.log("✅ Application started");
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
