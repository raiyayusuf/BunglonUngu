import { contactData } from "../data/contact-data.js";
import { navigateTo } from "../router.js";

export function loadContactPage() {
  console.log("📞 Loading contact page...");

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="contact-page">
      <!-- HERO SECTION -->
      <section class="contact-hero">
        <div class="hero-content">
          <h1 class="hero-title">Hubungi <span class="highlight">Bakule Kembang</span></h1>
          <p class="hero-subtitle">Siap melayani kebutuhan bunga Anda dengan senang hati</p>
          <p class="hero-description">
            Butuh buket untuk momen spesial? Ingin bertanya tentang produk? 
            Atau sekadar ingin ngobrol tentang bunga? Tim kami siap membantu!
          </p>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">
            <i class="fas fa-envelope-open-text fa-3x"></i>
            <p>Mari berkomunikasi dengan kami</p>
          </div>
        </div>
      </section>
      
      <!-- MAIN CONTACT GRID -->
      <div class="contact-grid">
        <!-- COLUMN 1: FLORIST CONTACT -->
        <section class="contact-section florist-contact">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-store"></i> Kontak Bakule Kembang
            </h2>
            <p class="section-subtitle">Untuk pemesanan bunga dan konsultasi florist</p>
          </div>
          
          <div class="contact-info-card">
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="contact-details">
                <h4>Alamat</h4>
                <p>${contactData.florist.address}</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fab fa-whatsapp"></i>
              </div>
              <div class="contact-details">
                <h4>WhatsApp</h4>
                <p>${contactData.florist.phone}</p>
                <a href="${contactData.socialLinks.whatsapp}" 
                   class="whatsapp-btn" 
                   target="_blank"
                   rel="noopener">
                  <i class="fab fa-whatsapp"></i> Chat via WhatsApp
                </a>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="contact-details">
                <h4>Email</h4>
                <p>${contactData.florist.email}</p>
                <a href="${contactData.socialLinks.email}" class="email-link">
                  Kirim Email
                </a>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fab fa-instagram"></i>
              </div>
              <div class="contact-details">
                <h4>Instagram</h4>
                <p>@${contactData.florist.instagram}</p>
                <a href="${contactData.socialLinks.instagram}" 
                   class="instagram-btn"
                   target="_blank"
                   rel="noopener">
                  <i class="fab fa-instagram"></i> Follow Kami
                </a>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="contact-details">
                <h4>Jam Operasional</h4>
                <p><strong>Senin - Jumat:</strong> ${
                  contactData.florist.operatingHours.weekdays
                }</p>
                <p><strong>Sabtu - Minggu:</strong> ${
                  contactData.florist.operatingHours.weekends
                }</p>
                <p class="hours-note">${
                  contactData.florist.operatingHours.note
                }</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- COLUMN 2: DEVELOPER CONTACT -->
        <section class="contact-section developer-contact">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-code"></i> Tentang Developer
            </h2>
            <p class="section-subtitle">Website ini dibuat oleh</p>
          </div>
          
          <div class="developer-card">
            <div class="developer-header">
              <div class="developer-avatar">
                <i class="fas fa-user-circle fa-3x"></i>
              </div>
              <div class="developer-info">
                <h3 class="developer-name">${contactData.developer.name}</h3>
                <p class="developer-role">${contactData.developer.role}</p>
              </div>
            </div>
            
            <p class="developer-description">
              ${contactData.developer.description}
            </p>
            
            <div class="developer-tech">
              <h4>Tech Stack Proyek Ini:</h4>
              <div class="tech-stack">
                ${contactData.developer.techStack
                  .map(
                    (tech) => `
                  <span class="tech-badge">
                    <i class="${tech.icon}"></i> ${tech.name}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div class="developer-social">
              <h4>Temukan Saya di Platform Berikut:</h4>
              <div class="social-links">
                <a href="${contactData.socialLinks.linkedin}" 
                   class="social-link linkedin"
                   target="_blank"
                   rel="noopener">
                  <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="${contactData.socialLinks.github}" 
                   class="social-link github"
                   target="_blank"
                   rel="noopener">
                  <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${contactData.socialLinks.email}" 
                   class="social-link email">
                  <i class="fas fa-envelope"></i> Email
                </a>
              </div>
            </div>
            
            <div class="developer-note">
              <div class="collaboration-container">
                <i class="fas fa-lightbulb collaboration-icon"></i>
                <div class="collaboration-content">
                  <p class="collab-question">Ingin kolaborasi project web development?</p>
                  <a href="${
                    contactData.socialLinks.email
                  }" class="collab-action">
                    Hubungi saya!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- FAQ SECTION -->
      <section class="faq-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-question-circle"></i> Pertanyaan yang Sering Ditanyakan
          </h2>
          <p class="section-subtitle">Temukan jawaban untuk pertanyaan umum</p>
        </div>
        
        <div class="faq-list">
          ${contactData.faqs
            .map(
              (faq, index) => `
            <div class="faq-item" data-index="${index}">
              <div class="faq-question">
                <h3>${faq.question}</h3>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="faq-answer">
                <p>${faq.answer}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      
      <!-- CALL TO ACTION -->
      <section class="contact-cta">
        <div class="cta-content">
          <h2 class="cta-title">Masih Ada Pertanyaan?</h2>
          <p class="cta-text">Jangan ragu untuk menghubungi kami melalui WhatsApp untuk respon cepat</p>
          <a href="${contactData.socialLinks.whatsapp}" 
             class="btn btn-whatsapp"
             target="_blank"
             rel="noopener">
            <i class="fab fa-whatsapp"></i> Chat via WhatsApp Sekarang
          </a>
          <p class="cta-note">
            Atau lihat koleksi bunga kami 
            <a href="#products" class="cta-link">di sini</a>
          </p>
        </div>
      </section>
    </div>
  `;

  // Setup event listeners
  setupContactPageEvents();
  console.log("✅ Contact page loaded");
}

function setupContactPageEvents() {
  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      // Close other open FAQs
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
          otherItem
            .querySelector(".faq-question i")
            .classList.remove("fa-chevron-up");
          otherItem
            .querySelector(".faq-question i")
            .classList.add("fa-chevron-down");
        }
      });

      // Toggle current FAQ
      item.classList.toggle("active");
      const icon = question.querySelector("i");

      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      } else {
        answer.style.maxHeight = null;
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      }
    });
  });

  // Navigation links
  const productLink = document.querySelector(".cta-link");
  if (productLink) {
    productLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo("#products");
    });
  }
}
