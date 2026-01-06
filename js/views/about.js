import { aboutData } from "../data/about-data.js";
import { teamMembers } from "../data/team-members.js";
import { createAboutCard } from "../components/about-card.js";
import { createTeamMemberCard } from "../components/team-member-card.js";
import { navigateTo } from "../router.js";

export function loadAboutPage() {
  console.log("📖 Loading about page...");

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="about-page">
      <!-- HERO SECTION -->
      <section class="about-hero">
        <div class="hero-content">
          <h1 class="hero-title">Tentang <span class="highlight">Bakule Kembang</span></h1>
          <p class="hero-subtitle">${aboutData.companyInfo.tagline}</p>
          <p class="hero-description">${aboutData.companyInfo.description}</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">${aboutData.milestones.length}+</span>
              <span class="stat-label">Tahun Pengalaman</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Pelanggan Bahagia</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${teamMembers.length}</span>
              <span class="stat-label">Tim Profesional</span>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">
            <i class="fas fa-store fa-3x"></i>
            <p>Toko Bakule Kembang di Yogyakarta</p>
          </div>
        </div>
      </section>
      
      <!-- VISI & MISI -->
      <section class="vision-mission-section">
        <div class="section-header">
          <h2 class="section-title">Visi & Misi Kami</h2>
          <p class="section-subtitle">Arah dan tujuan yang memandu setiap langkah kami</p>
        </div>
        
        <div class="vision-mission-grid">
          <div class="vision-card">
            <div class="card-header">
              <i class="fas fa-eye card-icon"></i>
              <h3>Visi Kami</h3>
            </div>
            <p class="vision-text">${aboutData.visionMission.vision}</p>
          </div>
          
          <div class="mission-card">
            <div class="card-header">
              <i class="fas fa-bullseye card-icon"></i>
              <h3>Misi Kami</h3>
            </div>
            <ul class="mission-list">
              ${aboutData.visionMission.missions
                .map(
                  (mission) =>
                    `<li><i class="fas fa-check-circle"></i> ${mission}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      </section>
      
      <!-- NILAI-NILAI PERUSAHAAN -->
      <section class="values-section">
        <div class="section-header">
          <h2 class="section-title">Nilai-Nilai Kami</h2>
          <p class="section-subtitle">Prinsip yang menjadi fondasi setiap karya kami</p>
        </div>
        
        <div class="values-grid" id="values-container">
          <!-- Values will be rendered here -->
        </div>
      </section>
      
      <!-- TIM KAMI -->
      <section class="team-section">
        <div class="section-header">
          <h2 class="section-title">Tim Kami</h2>
          <p class="section-subtitle">Orang-orang di balik keindahan Bakule Kembang</p>
        </div>
        
        <div class="team-grid" id="team-container">
          <!-- Team members will be rendered here -->
        </div>
      </section>
      
      <!-- JOURNEY / MILESTONES -->
      <section class="journey-section">
        <div class="section-header">
          <h2 class="section-title">Perjalanan Kami</h2>
          <p class="section-subtitle">Tonggak sejarah Bakule Kembang</p>
        </div>
        
        <div class="timeline" id="timeline-container">
          <!-- Milestones will be rendered here -->
        </div>
      </section>
      
      <!-- CALL TO ACTION -->
      <section class="about-cta">
        <div class="cta-content">
          <h2 class="cta-title">Siap Menghadirkan Keindahan untuk Anda</h2>
          <p class="cta-text">Mari ciptakan momen spesial dengan rangkaian bunga yang bermakna</p>
          <div class="cta-buttons">
            <button class="btn btn-primary" id="explore-products">
              <i class="fas fa-store"></i> Lihat Koleksi
            </button>
            <button class="btn btn-outline" id="contact-us">
              <i class="fas fa-envelope"></i> Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  `;

  // Render dynamic components
  renderValues();
  renderTeam();
  renderTimeline();
  setupEventListeners();

  console.log("✅ About page loaded");
}

function renderValues() {
  const container = document.getElementById("values-container");
  if (!container) return;

  aboutData.companyValues.forEach((value) => {
    const card = createAboutCard(value, "value");
    container.appendChild(card);
  });
}

function renderTeam() {
  const container = document.getElementById("team-container");
  if (!container) return;

  teamMembers.forEach((member) => {
    const card = createTeamMemberCard(member);
    container.appendChild(card);
  });
}

function renderTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  aboutData.milestones.forEach((milestone) => {
    const card = createAboutCard(milestone, "milestone");
    container.appendChild(card);
  });
}

function setupEventListeners() {
  const exploreBtn = document.getElementById("explore-products");
  const contactBtn = document.getElementById("contact-us");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      navigateTo("#products");
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      navigateTo("#contact");
    });
  }
}
