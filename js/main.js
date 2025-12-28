import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { router } from "./router.js";
// import { getFeaturedProducts } from "../data/products.js";
// import { getRecentTestimonials } from "../data/testimonials.js";

// global state
let currentPage = null;

// application
function initApp() {
  console.log("Bakule Kembang Initializing...");

  renderNavbar();
  renderFooter();

  setupRouter();

  setTimeout(() => {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.style.display = "none";
        // PENTINGGGG===========
        router();
      }, 500);
    }
  }, 1000); // loading time nya
  console.log("Application started✅");
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
