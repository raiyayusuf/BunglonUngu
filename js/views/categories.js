import {
  categories,
  flowerTypes,
  priceRanges,
  featuredFilter,
} from "../data/categories.js";
import { products } from "../data/products.js";
import { navigateTo } from "../router.js";

export function loadCategoriesPage() {
  console.log("🏷️ Loading categories page...");

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="categories-page">
      <!-- HEADER -->
      <div class="page-header">
        <h1>🏷️ Kategori Produk</h1>
        <p>Jelajahi koleksi bunga kami berdasarkan kategori</p>
      </div>
      
      <div class="categories-container">
        <!-- MAIN CATEGORIES -->
        <div class="category-section">
          <h2><i class="fas fa-gift"></i> Jenis Packaging</h2>
          <div class="categories-grid">
            ${categories
              .map(
                (cat) => `
              <div class="category-card" data-category="${cat.id}">
                <div class="category-icon">${cat.icon}</div>
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <div class="category-stats">
                  <span class="product-count">${cat.count} produk</span>
                </div>
                <button class="btn btn-outline view-btn" data-category="${cat.id}">
                  Lihat Produk
                </button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <!-- FLOWER TYPES -->
        <div class="category-section">
          <h2><i class="fas fa-leaf"></i> Jenis Bunga</h2>
          <div class="categories-grid">
            ${flowerTypes
              .map(
                (flower) => `
              <div class="category-card" data-flower="${flower.id}">
                <div class="category-icon">${flower.icon}</div>
                <h3>${flower.name}</h3>
                <div class="category-stats">
                  <span class="product-count">${flower.count} produk</span>
                </div>
                <button class="btn btn-outline view-btn" data-flower="${flower.id}">
                  Lihat Produk
                </button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <!-- PRICE RANGES -->
        <div class="category-section">
          <h2><i class="fas fa-tag"></i> Rentang Harga</h2>
          <div class="categories-grid price-categories">
            ${priceRanges
              .map(
                (range) => `
              <div class="category-card price-card" data-price="${range.id}">
                <div class="category-icon"><i class="fas fa-money-bill-wave"></i></div>
                <h3>${range.name}</h3>
                <div class="price-range">
                  <div class="price-bar">
                    <div class="price-fill" style="width: ${
                      (range.max === Infinity ? 250000 : range.max) / 2500
                    }%"></div>
                  </div>
                </div>
                <div class="category-stats">
                  <span class="product-count">${range.count} produk</span>
                </div>
                <button class="btn btn-outline view-btn" data-price="${
                  range.id
                }">
                  Lihat Produk
                </button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <!-- QUICK LINKS -->
        <div class="quick-links">
          <div class="quick-link-card" id="all-products">
            <div class="quick-icon"><i class="fas fa-th-large"></i></div>
            <h3>Semua Produk</h3>
            <p>${products.length} produk tersedia</p>
          </div>
          
          <div class="quick-link-card" id="featured-products">
            <div class="quick-icon"><i class="fas fa-star"></i></div>
            <h3>Produk Unggulan</h3>
            <p>${featuredFilter.count} produk pilihan</p>
          </div>
        </div>
      </div>
    </div>
  `;

  initializeCategoriesPage();
}

function initializeCategoriesPage() {
  console.log("🔧 Initializing categories page...");

  // Click handlers untuk kategori
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("🖱️ Button clicked:", this);

      const card = this.closest(".category-card");
      if (!card) {
        console.error("❌ No card found for button");
        return;
      }

      let filterType = "";
      let filterValue = "";
      let filterLabel = "";

      // Cek tipe kategori
      if (card.dataset.category) {
        filterType = "category";
        filterValue = card.dataset.category;
        const cat = categories.find((c) => c.id === filterValue);
        filterLabel = cat?.name || filterValue;
      } else if (card.dataset.flower) {
        filterType = "flowerType";
        filterValue = card.dataset.flower;
        const flower = flowerTypes.find((f) => f.id === filterValue);
        filterLabel = flower?.name || filterValue;
      } else if (card.dataset.price) {
        filterType = "priceRange";
        filterValue = card.dataset.price;
        const range = priceRanges.find((r) => r.id === filterValue);
        filterLabel = range?.name || filterValue;
      }

      console.log(
        `🎯 Filter to apply: ${filterType} = ${filterValue} (${filterLabel})`
      );

      if (filterType && filterValue) {
        // Simpan filter ke sessionStorage
        const filterData = {
          type: filterType,
          value: filterValue,
          label: filterLabel,
          timestamp: Date.now(),
        };

        sessionStorage.setItem("categoryFilter", JSON.stringify(filterData));
        console.log("💾 Saved filter to sessionStorage:", filterData);

        // Navigate ke products page
        window.location.hash = "#products";
      } else {
        console.error("❌ Could not determine filter type");
      }
    });
  });

  // Quick links - All Products
  const allProductsBtn = document.getElementById("all-products");
  if (allProductsBtn) {
    allProductsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🌐 Navigating to all products");
      sessionStorage.removeItem("categoryFilter");
      window.location.hash = "#products";
    });
  }

  // Quick links - Featured Products
  const featuredBtn = document.getElementById("featured-products");
  if (featuredBtn) {
    featuredBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("⭐ Navigating to featured products");
      const filterData = {
        type: "featured",
        value: true,
        label: "Produk Unggulan",
        timestamp: Date.now(),
      };
      sessionStorage.setItem("categoryFilter", JSON.stringify(filterData));
      window.location.hash = "#products";
    });
  }

  // Make whole card clickable (optional)
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Jangan trigger kalau klik tombol
      if (e.target.closest(".view-btn") || e.target.tagName === "BUTTON") {
        return;
      }
      const btn = this.querySelector(".view-btn");
      if (btn) btn.click();
    });
  });

  console.log("✅ Categories page event listeners setup complete");
}
