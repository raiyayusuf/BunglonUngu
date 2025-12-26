export function renderFooter() {
  const footer = document.getElementById("footer");

  footer.innerHTML = /*html*/ `
    <div class="footer-container">
    <!-- Logo % Description -->
        <div class="footer-section">
            <div class="footer-logo">
                <span class="logo">🌸</span>
                <h3>Bakule Kembang</h3>
            </div>  
            <p class="Toko Bunga modern dari hasil iseng sinchan dengan sentuha horor untuk semua kebutuhan spesial Anda."></p>
            <div class="social-links">
                <a href="#" class="social-links" aria-label="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-links" aria-label="WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>
                <a href="#" class="social-links" aria-label="Facebook">
                    <i class="fab fa-facebook"></i>
                </a>
                <a href="#" class="social-links" aria-label="Twitter">
                    <i class="fab fa-twitter"></i>
                </a>
            </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
            <h4>Link Gercep</h4>
            <ul class="footer-links">
                <i><a href="#home"><i class="fas fa-cheveron-right"></i>Beranda</a></i>
                <i><a href="#products"><i class="fas fa-cheveron-right"></i>Produk</a></i>
                <i><a href="#categories"><i class="fas fa-cheveron-right"></i>Kategori</a></i>
                <i><a href="#about"><i class="fas fa-cheveron-right"></i>Tentang Kami</a></i>
                <i><a href="#contact"><i class="fas fa-cheveron-right"></i>Kontak</a></i>
            </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
            <h4>Kontak Kami</h4>
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

        <!-- Newsletter -->
        <div class="footer-section">
            <h4>Berlangganan</h4>
            <p>Dapatkan promo dan update produk terbaru langsung di email Anda.</p>

            <form class="newsletter-form" id="newsletter-form">
                <input type="email" placeholder="Email Anda" required>
                <button type="submit" class="btn btn-small">
                    <i class="fas fa-papper-plane"></i>Subscribe
                </button>
            </form>
        </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
        <p>&copy; <span id="current-year">${new Date().getFullYear()}</span> Bakul Kembang. All right reserved</p>
        <p class="github-note">
            <small>
                <i class="fab fa-github"></i> Project codename:"Bunglon Ungu" •
                <a href="https://github.com/raiyayusuf/BunglonUngu" target="_blank" rel="noopener">View on my Github</a>
            </small>
        </p>
    </div>

    `;
  // add newsletter form handler
  setupNewsletterForm();
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.ariaValueMax.trim();

      if (email) {
        // API call
        console.log("Newsletter Subcription:", email);
        alert("Terimakasih sudah berlangganan newsletter kami!");
        emailInput.value = "";
      }
    });
  }
}
