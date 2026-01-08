import { loadHomePage } from "./views/home.js";
import { loadProductsPage } from "./views/products.js";
import { loadAboutPage } from "./views/about.js";
import { loadCartPage } from "./views/cart.js";
import { loadProductDetailPage } from "./views/product-detail.js";
import { updateNavActive } from "./components/navbar.js";
import { loadContactPage } from "./views/contact.js";
import { loadCategoriesPage } from "./views/categories.js";
import { loadCheckoutPage } from "./views/checkout.js";
import { loadOrdersPage } from "./views/orders.js";
import { loadOrderDetailPage } from "./views/order-detail.js";

// config router
const routes = {
  "": "home",
  "#home": "home",
  "#products": "products",
  "#product": "product-detail",
  "#categories": "categories",
  "#about": "about",
  "#contact": "contact",
  "#cart": "cart",
  "#checkout": "checkout",
  "#orders": "orders",
  "#order-detail": "order-detail",
};

// main router function
export function router() {
  const app = document.getElementById("app");

  const hash = window.location.hash || "#home";
  console.log(`Rounting to: ${hash}`);

  if (hash !== "#checkout") {
    localStorage.removeItem("bakule_kembang_selected_items");
    console.log("🧹 Cleared selected items (not going to checkout)");
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // atau 'smooth' kalo mau animasi
  });

  app.innerHTML =
    '<div class="page-loading">Loading...<div class="spinner">🌸</div><p>Loading...</p></div>';
  const [baseRoute, param] = hash.split("/");
  const route = routes[baseRoute] || "not-found";

  switch (route) {
    case "home":
      loadHomePage();
      break;

    case "products":
      loadProductsPage();
      break;

    case "product-detail":
      if (param) {
        loadProductDetailPage(param);
      } else {
        navigateTo("#products");
      }
      break;

    case "about":
      loadAboutPage();
      break;

    case "checkout":
      loadCheckoutPage();
      break;

    case "categories":
      loadCategoriesPage();
      break;

    case "contact":
      loadContactPage();
      break;

    case "cart":
      loadCartPage();
      break;

    case "orders":
      loadOrdersPage(); // Riwayat order (list)
      break;

    case "order-detail":
      if (param) {
        loadOrderDetailPage(param); // param = orderId
      } else {
        navigateTo("#orders");
      }
      break;

    default:
      loadNotFoundPage();
      break;
  }

  updateNavActive(baseRoute);
}

export function navigateTo(hash) {
  window.location.hash = hash;
}

function loadNotFoundPage() {
  const app = document.getElementById("app");
  app.innerHTML = `    
    <div class="page-container">
      <h1>404 Not Found</h1>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <a href="#home" class="btn btn-primary">Kembali ke Beranda</a>
    </div>
  `;
}
