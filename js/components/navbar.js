export function updateNavActive(activeHash) {
  console.log(`🎯 Updating nav active for: ${activeHash}`);

  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current route
  const activeLink = document.querySelector(`.nav-link[href="${activeHash}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }

  // Special case for home (empty hash or #home)
  if (activeHash === "" || activeHash === "#home") {
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) {
      homeLink.classList.add("active");
    }
  }
}

export function renderNavbar() {
  const navbar = document.getElementById("navbar");

  navbar.innerHTML = /*html*/ `
    <div class="nav-container">
      <!-- Brand / Logo -->
      <div class="nav-brand">
        <span class="logo">🌸</span>
        <h1>Bakule <span class="highlight">Kembang</span></h1>
        <small class="tagline">Florist Yogyakarta</small>
      </div>

      <!-- Navigation Menu -->
      <ul class="nav-menu" id="nav-menu">
        <li class="nav-item">
          <a href="#home" class="nav-link active" data-page="home">
            <i class="fas fa-home"></i>
            <span class="nav-text">Home</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#products" class="nav-link" data-page="products">
            <i class="fas fa-store"></i>
            <span class="nav-text">Produk</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#categories" class="nav-link" data-page="categories">
            <i class="fas fa-list"></i>
            <span class="nav-text">Kategori</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#about" class="nav-link" data-page="about">
            <i class="fas fa-info-circle"></i>
            <span class="nav-text">Tentang</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#contact" class="nav-link" data-page="contact">
            <i class="fas fa-phone"></i>
            <span class="nav-text">Kontak</span>
          </a>
        </li>
      </ul>

      <!-- Cart & Actions -->
      <div class="nav-actions">
        <button class="cart-btn" id="cart-btn" aria-label="Open cart">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-text">Cart</span>
          <span class="cart-count" id="cart-count">0</span>
        </button>

        <button class="theme-toggle" id="theme-toggle" aria-label="Toogle theme">
          <i class="fas fa-moon"></i>
        </button>

        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

  `;
  // event listeners after rendering
  setupNavbarEvents();
}

function setupNavbarEvents() {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");

      // Change icon
      const icon = menuToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Cart button click
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      console.log("Cart button clicked - will open sidebar later");
      // Nanti ini akan buka cart sidebar
      alert("Cart functionality coming soon!");
    });
  }

  // Theme toggle (dark/light mode)
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const icon = themeToggle.querySelector("i");

      if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
      }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
    }
  }

  // Nav link clicks - update active state
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Update active class
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.querySelector("i").classList.replace("fa-times", "fa-bars");
      }
    });
  });
}

// update cart count (akan di panggil dari cart service nanti)
export function updateCartCount(count) {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = count;

    // add animasi
    cartCount.classList.add("pulse");
    setTimeout(() => {
      cartCount.classList.remove("pulse");
    }, 300);
  }
}
