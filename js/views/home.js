import { getFeaturedProducts } from "../data/products.js";
import { getRecentTestimonials } from "../data/testimonials.js";
import { addToCart } from "../services/cart-service.js";

export function loadHomePage() {
  console.log("Loading home page...");

  const app = document.getElementById("app");
  const featuredProducts = getFeaturedProducts().slice(0, 25);
  const recentTestimonials = getRecentTestimonials(6);

  app.innerHTML = /*html*/ `
    <section class="hero-section">
      <div class="hero-content">
        <h2 class="hero-title">Keindahan dalam Setiap Kelopak</h2>
        <p class="hero-subtitle">
          Bakule Kembang menghadirkan buket bunga segar dengan sentuhan tradisional dan modern
        </p>
        <div class="hero-actions">
          <a href="#products" class="btn btn-primary">
            <i class="fas fa-store"></i> Lihat Koleksi
          </a>
          <a href="#categories" class="btn btn-outline">
            <i class="fas fa-list"></i> Jelajahi Kategori
          </a>
        </div>
      </div>
      <div class="hero-image">
        <div class="image-placeholder">
          <i class="fas fa-flower"></i>
          <p>Hero image akan ditampilkan di sini</p>
        </div>
      </div>
    </section>
    
    <section class="features-section">
      <h3 class="section-title">Mengapa Memilih Kami?</h3>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🌸</div>
          <h4>Bunga Segar</h4>
          <p>Bunga pilihan dengan kualitas terbaik langsung dari petani handal</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🚚</div>
          <h4>Gratis Pengiriman</h4>
          <p>Gratis ongkir untuk area Yogyakarta dengan pembelian minimal Rp 250.000</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💝</div>
          <h4>Kustomisasi</h4>
          <p>Buat buket sesuai keinginan Anda dengan bantuan florist profesional</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h4>Kualitas Terbaik</h4>
          <p>Garansi 100% kepuasan pelanggan dengan kualitas terbaik atau uang kembali</p>
        </div>
      </div>
    </section>
    
    <section class="featured-products-section">
      <h2 class="section-title">🌺 Produk Unggulan</h2>
      <div class="products-grid">
        ${featuredProducts
          .map(
            (product) => `
          <div class="product-card" data-id="${product.id}">
            <div class="product-image">
              <img src="${product.image}" alt="${
              product.name
            }" loading="lazy" onerror="this.src='assets/image/placeholder.jpg'; this.onerror=null;">
              ${
                product.featured
                  ? '<span class="featured-badge">Unggulan</span>'
                  : ""
              }
            </div>
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <p class="product-description">${product.description}</p>
              <div class="product-meta">
                <span class="product-price">Rp ${product.price.toLocaleString(
                  "id-ID"
                )}</span>
                <span class="product-rating">⭐ ${product.rating}</span>
              </div>
              <button class="btn btn-primary add-to-cart" data-id="${
                product.id
              }">
                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>
    
    <section class="testimonials-section">
      <h2 class="section-title">💬 Testimoni Pelanggan</h2>
      <div class="testimonials-grid">
        ${recentTestimonials
          .map(
            (testimonial) => `
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-rating">
                ${"⭐".repeat(testimonial.rating)}
              </div>
              <div class="testimonial-date">${new Date(
                testimonial.date
              ).toLocaleDateString("id-ID")}</div>
            </div>
            <p class="testimonial-text">"${testimonial.comment}"</p>
            <div class="testimonial-author">
              <strong>${testimonial.name}</strong>
              <span>• ${testimonial.role}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>
  `;

  setupHomePageEvents();
}

function setupHomePageEvents() {
  console.log("🏠 Setting up home page events...");
  document.body.removeEventListener("click", handleBodyClick);
  document.body.addEventListener("click", handleBodyClick);
}

function handleBodyClick(e) {
  if (e.target.closest(".add-to-cart")) {
    const button = e.target.closest(".add-to-cart");
    e.stopPropagation();
    e.preventDefault();

    const productId = parseInt(button.getAttribute("data-id"));
    console.log(`🛒 Adding product ${productId} to cart`);

    const success = addToCart(productId, 1);

    if (success) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
      button.classList.add("added");
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("added");
        button.disabled = false;
      }, 2000);
    }
  }

  if (e.target.closest(".product-card") && !e.target.closest(".add-to-cart")) {
    const card = e.target.closest(".product-card");
    const productId = card.getAttribute("data-id");
    console.log(`👁️ Viewing product ${productId} detail`);
  }
}
