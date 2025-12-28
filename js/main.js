import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { getFeaturedProducts } from "../data/products.js";
import { getRecentTestimonials } from "../data/testimonials.js";

// application
function initApp() {
  console.log("Bakule Kembang Initializing...");

  renderNavbar();
  renderFooter();

  setTimeout(() => {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.style.display = "none";
        // show home page
        showHomePage();
      }, 500);
    }
  }, 1000); // loading time nya
  console.log("Application started✅");
}

function showHomePage() {
  const app = document.getElementById("app");
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const recentTestimonials = getRecentTestimonials(3);

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
        
        <!-- FEATURED PRODUCTS SECTION -->
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
                    }" loading="lazy">
                            ${
                              product.featured
                                ? '<span class="featured-badge">Unggulan</span>'
                                : ""
                            }
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-description">${
                              product.description
                            }</p>
                            <div class="product-meta">
                                <span class="product-price">Rp ${product.price.toLocaleString(
                                  "id-ID"
                                )}</span>
                                <span class="product-rating">⭐ ${
                                  product.rating
                                }</span>
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
        
        <!-- TESTIMONIALS SECTION -->
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

  // Add event listeners
  setupAddToCartButtons();
}

function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      console.log(`Adding product ${productId} to cart`);
      alert(`Produk berhasil ditambahkan ke keranjang!`);
    });
  });
}

// CSS untuk home page

const style = document.createElement("style");
style.textContent = /*css*/ `
    .hero-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
        padding: 3rem 0;
    }

    .hero-title {
        font-size: 2.5rem;
        color: var(--primary-dark);
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    .hero-subtitle {
        font-size: 2.5;
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .hero-image {
        background: linear-gradient(135deg, var(--primary-soft) 0%, var(--primary-light) 100%);
        border-radius: 20px;
        height: 300px;
        display: flex;
        justify-content: center;
        color: white;
    }

    .image-placeholder {
        text-align: center;
        padding: 2rem;
    }

    .image-placeholder i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.8;
    }

    .features-section {
        margin-top: 4rem;
        padding-top: 3rem;
        border-top: 2px solid var(--primary-soft);
    }

    .section-title {
        text-align: center;
        font-size: 2rem;
        color: var(--primary-dark);
        margin-bottom: 2rem;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }

    .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 5px 20px var(--shadow);
        text-align: center;
        transition: transform 0.3s ease;
    }

    .feature-card h4 {
        color: var(--primary);
        margin-bottom: 0.8rem;
        font-size: 1.3rem;
    }

    .feature-card p {
        color: #666;
        line-height: 1.5;
    }

    .feature-card:hover {
        transform: translateY(-10px);
    }

    .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    // =========================

    .featured-products-section {
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 2px solid var(--primary-soft);
    }

    .testimonials-section {
    margin-top: 5rem;
    // padding-top: 2rem;
    border-top: 2px solid var(--primary-soft);
    // padding-bottom: 4rem;
    }
    
    .section-title {
        text-align: center;
        font-size: 2rem;
        color: var(--primary-dark);
        margin-bottom: 2rem;
        margin-top: 2rem;
    }
    
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .product-card {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 5px 20px var(--shadow);
        transition: transform 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-10px);
    }
    
    .product-image {
        position: relative;
        height: 200px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f8f9fa;
    }
    
    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        max-height: 100%;
    }
    
    .featured-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary);
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .product-info {
        padding: 1.5rem;
    }
    
    .product-name {
        font-size: 1.2rem;
        color: var(--primary-dark);
        margin-bottom: 0.5rem;
    }
    
    .product-description {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .product-price {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--primary);
    }
    
    .product-rating {
        background: #ffd700;
        color: #333;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .testimonial-card {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 5px 20px var(--shadow);
    }
    
    .testimonial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .testimonial-rating {
        color: #ffd700;
        font-size: 1.2rem;
    }
    
    .testimonial-date {
        color: #888;
        font-size: 0.85rem;
    }
    
    .testimonial-text {
        color: #555;
        line-height: 1.6;
        margin-bottom: 1rem;
        font-style: italic;
    }
    
    .testimonial-author {
        color: #333;
        font-size: 0.9rem;
    }

    // =========================

    @media (max-width: 768px) {
        .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-actions {
            justify-content: center;
        }

        .products-grid, .testimonials-grid {
            grid-template-columns: 1fr;
        }
        
        .section-title {
            font-size: 1.5rem;
        }
    }
`;

document.head.appendChild(style);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
