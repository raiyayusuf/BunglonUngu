export function renderFooter() {
  const footer = document.getElementById("footer");
  const currentYear = new Date().getFullYear();

  footer.innerHTML = /*html*/ `
      <div class="footer-container">
        <!-- Kolom 1: Logo & Description -->
        <div class="footer-section logo-section">
          <div class="footer-logo-container">
            <span class="footer-logo">🌸</span>
            <div class="footer-brand">
              <h3>Bakule Kembang</h3>
              <p class="footer-tagline">FLORIST YOGYAKARTA</p>
            </div>
          </div>  
          <p class="footer-description">
            Toko Bunga modern dari hasil iseng sinchan dengan sentuhan horor untuk semua kebutuhan spesial Anda.
          </p>
        </div>

        <!-- Kolom 2: Quick Links -->
        <div class="footer-section">
          <h4>Link Gercep</h4>
          <ul class="footer-links">
            <li><a href="#home" data-navigo><i class="fas fa-chevron-right"></i> Beranda</a></li>
            <li><a href="#products" data-navigo><i class="fas fa-chevron-right"></i> Produk</a></li>
            <li><a href="#categories" data-navigo><i class="fas fa-chevron-right"></i> Kategori</a></li>
            <li><a href="#about" data-navigo><i class="fas fa-chevron-right"></i> Tentang Kami</a></li>
            <li><a href="#contact" data-navigo><i class="fas fa-chevron-right"></i> Kontak</a></li>
          </ul>
        </div>

        <!-- Kolom 3: Contact Info -->
        <div class="footer-section">
          <h4>Alamat & Kontak</h4>
          <ul class="contact-info">
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>JL. KH. Ali Maksum, Saraban RT05, Ngireng-Ireng, Sewon, Bantul, Yogyakarta 55188</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span>0822 2718 0340</span>
            </li>
            <li>
              <i class="fas fa-clock"></i>
              <span>Buka: 08.00 - 22.00 WIB (Setiap Hari)</span>
            </li>
          </ul>
        </div>

        <!-- 🔥 Kolom 4: Media Sosial (SIMPLE ICONS 2x2) -->
        <div class="footer-section social-section">
          <h4>Media Sosial</h4>
          <p class="social-description">Ikuti kami di media sosial:</p>
          <div class="social-icons-grid">
            <a href="https://wa.me/6282227180340" target="_blank" class="social-icon-link" aria-label="WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
            
            <a href="https://www.instagram.com/raiyaysf_/" target="_blank" class="social-icon-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            
            <a href="https://github.com/raiyayusuf" target="_blank" class="social-icon-link" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
            
            <a href="https://www.linkedin.com/in/raiya-yusuf-priatmojo" target="_blank" class="social-icon-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Kolom 5: Newsletter -->
        <div class="footer-section newsletter-section">
          <h4>Berlangganan</h4>
          <p>Dapatkan promo dan update produk terbaru langsung di email Anda.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" placeholder="Email Anda" required>
            <button type="submit" class="btn-subscribe">
              <i class="fas fa-paper-plane"></i> Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>&copy; ${currentYear} Bakule Kembang. All rights reserved</p>
        <p class="github-note">
          <small>
            <i class="fab fa-github"></i> Project codename: "Bunglon Ungu" • 
            <a href="https://github.com/raiyayusuf/BunglonUngu" target="_blank" rel="noopener noreferrer">
              View on my GitHub
            </a>
          </small>
        </p>
      </div>
  `;

  // Setup newsletter form handler
  setupNewsletterForm();
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (email && validateEmail(email)) {
        // Simpan ke localStorage (simulasi)
        const subscribers = JSON.parse(
          localStorage.getItem("newsletterSubscribers") || "[]"
        );
        subscribers.push({
          email: email,
          date: new Date().toISOString(),
        });
        localStorage.setItem(
          "newsletterSubscribers",
          JSON.stringify(subscribers)
        );

        console.log("Newsletter Subscription:", email);

        // Feedback ke user
        alert(
          "🎉 Terima kasih sudah berlangganan newsletter kami! Kami akan mengirimkan promo terbaru ke email Anda."
        );
        emailInput.value = "";

        // Optional: Reset form
        this.reset();
      } else {
        alert("⚠️ Mohon masukkan email yang valid!");
        emailInput.focus();
      }
    });
  }
}

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.(com|co\.id)$/;
  return re.test(email);
}
