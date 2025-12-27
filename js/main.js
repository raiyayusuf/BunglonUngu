import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";

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
      });
    }
  }, 1000); // loading time nya
  console.log("Application started");
}

function showHomePage() {
  const app = document.getElementById("app");

  app.innerHTML = /*html*/ `
    <section class="hero-section">
    <div class="hero-content">
        <h2 class="hero-title">Keindahan dalam Setiap Kelopak</h2>
        <p class="hero-subtitle">
        Bakule Kembang menghadirkan buket bunga segar dengan sentuhan horor dan
        modern
        </p>
        <div class="hero-actions">
        <a href="#product" class="btn btn-primary"
            >\ <i class="fas fa-store"></i> Lihat Koleksi
        </a>
        <a href="#categories" class="btn btn-outline">
            <i class="fas fa-list"></i> Jelajahi Kategori
        </a>
        </div>
    </div>
    <div class="hero-image">
        <!-- Placeholder gambar -->
        <div>
        <i class="fas fa-flower"></i>
        <p>Hero image akan di tampilkan di sini</p>
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
        <p>Gratis ongkir untuk area Yogyakarta dengan pembelian minimal Rp250.000</p>
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
    `;
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

    @media (max-width: 768px) {
        .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-actions {
            justify-content: center;
        }
    }
`;

document.head.appendChild(style);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
