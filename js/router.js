import { loadHomePage } from "./views/home.js";
import { loadProductsPage } from "./views/products.js";
import { loadAboutPage } from "./views/about.js";
import { loadCartPage } from "./views/cart.js";
import { loadProductDetailPage } from "./views/product-detail.js";
import { updateNavActive } from "./components/navbar.js";

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
};

// main router function
export function router() {
  const app = document.getElementById("app");

  const hash = window.location.hash || "#home";
  console.log(`Rounting to: ${hash}`);

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

    case "cart":
      loadCartPage();
      break;

    case "contact":
      loadContactPage();
      break;

    case "categories":
      loadCategoriesPage();
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

function loadContactPage() {
  const app = document.getElementById("app");
  app.innerHTML = `    
    <div class="page-container">
      <h1>Kontak Kami</h1>
      <p>Halaman kontak sedang dalam pengembangan...</p>
    </div>
  `;
}

function loadCategoriesPage() {
  const app = document.getElementById("app");
  app.innerHTML = `    
    <div class="page-container">
      <h1>Kategori Produk</h1>
      <p>Halaman kategori sedang dalam pengembangan...</p>
    </div>
  `;
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
