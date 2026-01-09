// js/views/product-detail.js
import {
  getProductById,
  getRelatedProducts,
} from "../services/product-service.js";
import { addToCart } from "../services/cart-service.js";
import { navigateTo } from "../router.js";
import { renderProductCards } from "../components/product-card.js";

export function loadProductDetailPage(productId) {
  const app = document.getElementById("app");

  // Convert to number
  const id = parseInt(productId);

  // Get product data
  const product = getProductById(id);

  if (!product) {
    app.innerHTML = `
      <div class="page-container">
        <h1>Produk Tidak Ditemukan</h1>
        <p>Maaf, produk yang Anda cari tidak tersedia.</p>
        <a href="#products" class="btn btn-primary">Kembali ke Produk</a>
      </div>
    `;
    return;
  }

  // Get related products
  const relatedProducts = getRelatedProducts(id, 4);

  // Format price
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  // Build stars for rating
  const stars =
    "★".repeat(Math.floor(product.rating)) +
    "☆".repeat(5 - Math.floor(product.rating));

  app.innerHTML = `
    <div class="product-detail-page"> 
      <!-- Judul Halaman Detail -->
      <div class="page-header">
        <h1>🔍 Detail Produk</h1>
        <p>Informasi lengkap tentang ${product.name}</p>
      </div>
    
      <!-- Main Product Detail -->
      <div class="product-detail-container">
        <!-- Product Images (Left Side) -->
        <div class="product-images">
          <div class="main-image">
            <img src="${product.image}" alt="${
    product.name
  }" class="product-main-image" id="product-main-image">
            ${
              product.featured
                ? '<span class="featured-badge">⭐ Unggulan</span>'
                : ""
            }
          </div>
          <!-- Can add thumbnail gallery here later -->
        </div>
        
        <!-- Product Info (Right Side) -->
        <div class="product-info-detail">
          <div class="product-header">
            <h1 class="product-title">${product.name}</h1>
            <div class="product-meta">
              <span class="product-rating">
                ${stars} <strong>${product.rating}</strong> (${
    product.reviewCount || 0
  } ulasan)
              </span>
              <span class="product-sku">SKU: FL${product.id
                .toString()
                .padStart(3, "0")}</span>
            </div>
          </div>
          
          <div class="product-price-section">
            <h2 class="product-price-detail">${formattedPrice}</h2>
            <span class="product-status ${
              product.inStock ? "in-stock" : "out-of-stock"
            }">
              ${product.inStock ? "✅ Stok Tersedia" : "❌ Stok Habis"}
            </span>
          </div>
          
          <div class="product-description-full">
            <h3>Deskripsi Produk</h3>
            <p>${product.description}</p>
          </div>
          
          <div class="product-specifications">
            <h3>Spesifikasi</h3>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">Kategori:</span>
                <span class="spec-value">${product.category}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Jenis Bunga:</span>
                <span class="spec-value">${product.flowerType}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Warna:</span>
                <span class="spec-value">
                  ${product.color
                    .map(
                      (c) =>
                        `<span class="color-chip" style="background-color: ${getColorCode(
                          c
                        )}" title="${c}"></span>`
                    )
                    .join("")}
                  ${product.color.join(", ")}
                </span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Tags:</span>
                <span class="spec-value">
                  ${product.tags
                    .map((tag) => `<span class="tag">${tag}</span>`)
                    .join("")}
                </span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Ukuran:</span>
                <span class="spec-value">${product.size || "Standar"}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Freshness:</span>
                <span class="spec-value">${
                  product.freshness || "Segar 3-5 hari"
                }</span>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="product-actions">
            <div class="quantity-selector">
              <button class="qty-btn minus" id="qty-minus">-</button>
              <input type="number" id="product-quantity" value="1" min="1" max="10">
              <button class="qty-btn plus" id="qty-plus">+</button>
            </div>
            
            <button class="btn btn-primary btn-add-to-cart" id="add-to-cart-btn" data-id="${
              product.id
            }">
              <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
            </button>
            
            <button class="btn btn-outline btn-wishlist" id="wishlist-btn">
              <i class="far fa-heart"></i> Wishlist
            </button>
          </div>
          
          <!-- Additional Info -->
          <div class="product-extra-info">
            <div class="info-item">
              <i class="fas fa-shipping-fast"></i>
              <span>Gratis ongkir Yogyakarta</span>
            </div>
            <div class="info-item">
              <i class="fas fa-undo"></i>
              <span>Garansi kesegaran 2 hari</span>
            </div>
            <div class="info-item">
              <i class="fas fa-gift"></i>
              <span>Bisa custom greeting card</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Related Products Section -->
      ${
        relatedProducts.length > 0
          ? `
        <section class="related-products">
          <h2>Produk Terkait</h2>
          <div class="related-products-grid" id="related-products-grid"></div>
        </section>
      `
          : ""
      }
      
      <!-- Reviews Section (Placeholder for now) -->
      <section class="product-reviews">
        <h2>Ulasan Pelanggan</h2>
        <div class="reviews-placeholder">
          <p>Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!</p>
          <button class="btn btn-outline">Tulis Ulasan</button>
        </div>
      </section>
      
      <!-- Back Button -->
      <div class="back-to-products">
        <a href="#products" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Kembali ke Semua Produk
        </a>
      </div>
    </div>
  `;

  // Initialize event listeners for this page
  initializeProductDetailPage(product);

  // Render related products
  if (relatedProducts.length > 0) {
    const relatedGrid = document.getElementById("related-products-grid");
    if (relatedGrid) {
      renderProductCards(relatedProducts, relatedGrid);
    }
  }
}

function getColorCode(colorName) {
  const colorMap = {
    Merah: "#ff4757",
    Putih: "#ffffff",
    Pink: "#ff9ff3",
    Hitam: "#2d3436",
    Hijau: "#00b894",
    Peach: "#ffb8b8",
    "Broken White": "#f5f5f5",
    Cream: "#ffeaa7",
    Kuning: "#fdcb6e",
    Ungu: "#a29bfe",
    Brown: "#a1887f",
    "Multi-color": "#ff6b6b",
  };
  return colorMap[colorName] || "#dfe6e9";
}

function initializeProductDetailPage(product) {
  // Quantity selector
  const qtyInput = document.getElementById("product-quantity");
  const minusBtn = document.getElementById("qty-minus");
  const plusBtn = document.getElementById("qty-plus");

  minusBtn?.addEventListener("click", () => {
    const currentVal = parseInt(qtyInput.value);
    if (currentVal > 1) {
      qtyInput.value = currentVal - 1;
    }
  });

  plusBtn?.addEventListener("click", () => {
    const currentVal = parseInt(qtyInput.value);
    if (currentVal < 10) {
      qtyInput.value = currentVal + 1;
    }
  });

  // Add to cart button
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      if (!product.inStock) {
        alert("Maaf, produk ini sedang habis stok.");
        return;
      }

      const quantity = parseInt(
        document.getElementById("product-quantity").value
      );

      try {
        const { addToCart } = await import("../services/cart-service.js");
        const success = addToCart(product.id, quantity);

        if (success) {
          // Visual feedback
          const originalHTML = addToCartBtn.innerHTML;
          addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
          addToCartBtn.classList.add("added");
          addToCartBtn.disabled = true;

          // Update cart badge
          window.dispatchEvent(new CustomEvent("cartUpdated"));

          setTimeout(() => {
            addToCartBtn.innerHTML = originalHTML;
            addToCartBtn.classList.remove("added");
            addToCartBtn.disabled = false;
          }, 1500);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  }

  // Wishlist button (placeholder)
  const wishlistBtn = document.getElementById("wishlist-btn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
      alert("Fitur wishlist akan segera hadir!");
    });
  }

  // Click on related products
  document.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.id;
      if (productId) {
        navigateTo(`#product/${productId}`);
      }
    }
  });
}
