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
  // Click handlers untuk kategori
  document.querySelectorAll(".category-card .view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".category-card");

      if (card.dataset.category) {
        // Packaging category
        navigateTo(`#products?category=${card.dataset.category}`);
      } else if (card.dataset.flower) {
        // Flower type
        navigateTo(`#products?flowerType=${card.dataset.flower}`);
      } else if (card.dataset.price) {
        // Price range
        navigateTo(`#products?priceRange=${card.dataset.price}`);
      }
    });
  });

  // Quick links
  document.getElementById("all-products").addEventListener("click", () => {
    navigateTo("#products");
  });

  document.getElementById("featured-products").addEventListener("click", () => {
    navigateTo("#products?featured=true");
  });

  // Hover effects
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", function () {
      const btn = this.querySelector(".view-btn");
      if (btn) btn.click();
    });
  });

  console.log("✅ Categories page loaded");
}
