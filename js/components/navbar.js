import { toggleCartSidebar } from "./cart-sidebar.js";

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
        <!-- LOGO IMAGE (hanya tampil di navbar full) -->
        <a href="#home" class="logo-link">
          <img 
            src="assets/image/logo/logo-bakule-kembang-navbar.png" 
            alt="Bakule Kembang"
            class="logo-img"
          >
        </a>
        
        <!-- TEKS BRAND (hanya tampil di navbar scrolled) -->
        <div class="brand-text">
          <h1>Bakule <span class="highlight">Kembang</span></h1>
          <small class="tagline">Florist Yogyakarta</small>
        </div>
      </div>

      <!-- Navigation Menu -->
      <ul class="nav-menu" id="nav-menu">
        <li><a href="#home" class="nav-link"><span class="nav-text">Home</span></a></li>
        <li><a href="#products" class="nav-link"><span class="nav-text">Produk</span></a></li>
        <li><a href="#categories" class="nav-link"><span class="nav-text">Kategori</span></a></li>
        <li><a href="#orders" class="nav-link"><span class="nav-text">Riwayat</span></a></li>
        <li><a href="#about" class="nav-link"><span class="nav-text">Tentang</span></a></li>
        <li><a href="#contact" class="nav-link"><span class="nav-text">Kontak</span></a></li>
      </ul>

      <!-- Cart & Actions -->
      <div class="nav-actions">
        <!-- Scrolled Hamburger (for desktop scroll) -->
        <button class="scrolled-hamburger" id="scrolled-hamburger" aria-label="Open menu">
          <i class="fas fa-bars"></i>
        </button>

        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <i class="fas fa-moon"></i>
        </button>

        <button class="cart-btn" id="cart-btn" aria-label="Open cart">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-text">Cart</span>
          <span class="cart-count" id="cart-count">0</span>
        </button>

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  `;
  // event listeners after rendering
  setupNavbarEvents();
  setupScrollEffect();
  setupScrolledHamburgerDropdown();

  window.addEventListener("cartUpdated", () => {
    updateCartCountFromStorage();
  });
}

function setupScrollEffect() {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll);

  // Initial check
  handleScroll();
}

function setupScrolledHamburgerDropdown() {
  const hamburger = document.getElementById("scrolled-hamburger");
  const dropdownId = "scrolled-dropdown";

  if (!hamburger) return;

  // Create dropdown jika belum ada
  if (!document.getElementById(dropdownId)) {
    createScrolledDropdown(dropdownId);
  }

  // Toggle dropdown on click
  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const dropdown = document.getElementById(dropdownId);
    const isActive = dropdown.classList.contains("active");

    // Toggle dropdown
    dropdown.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Close other dropdowns jika ada
    if (!isActive) {
      closeAllDropdownsExcept(dropdownId);
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
      dropdown.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });
}

function createScrolledDropdown(id) {
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  const dropdown = document.createElement("div");
  dropdown.id = id;
  dropdown.className = "scrolled-dropdown";

  dropdown.innerHTML = /*html*/ `
    <ul class="scrolled-dropdown-menu">
      <li><a href="#home" class="scrolled-dropdown-link"><i class="fas fa-home"></i> Home</a></li>
      <li><a href="#products" class="scrolled-dropdown-link"><i class="fas fa-store"></i> Produk</a></li>
      <li><a href="#categories" class="scrolled-dropdown-link"><i class="fas fa-list"></i> Kategori</a></li>
      <li><a href="#orders" class="scrolled-dropdown-link"><i class="fas fa-history"></i> Riwayat</a></li>
      <li><a href="#about" class="scrolled-dropdown-link"><i class="fas fa-info-circle"></i> Tentang</a></li>
      <li><a href="#contact" class="scrolled-dropdown-link"><i class="fas fa-phone"></i> Kontak</a></li>
    </ul>
  `;

  navActions.appendChild(dropdown);

  // Close dropdown when clicking a link
  dropdown.querySelectorAll(".scrolled-dropdown-link").forEach((link) => {
    link.addEventListener("click", () => {
      dropdown.classList.remove("active");
      document.getElementById("scrolled-hamburger").classList.remove("active");
    });
  });

  return dropdown;
}

function closeAllDropdownsExcept(exceptId) {
  document.querySelectorAll(".scrolled-dropdown").forEach((dropdown) => {
    if (dropdown.id !== exceptId) {
      dropdown.classList.remove("active");
    }
  });

  // Juga remove active dari hamburger buttons
  document.querySelectorAll(".scrolled-hamburger").forEach((btn) => {
    if (btn.id !== `scrolled-hamburger`) {
      btn.classList.remove("active");
    }
  });
}

function updateCartCountFromStorage() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const cart =
      JSON.parse(localStorage.getItem("bakule_kembang_cart_v1")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";

    // Add animation
    cartCount.classList.add("pulse");
    setTimeout(() => {
      cartCount.classList.remove("pulse");
    }, 300);
  }
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
    cartBtn.removeEventListener("click", handleCartClick);
    cartBtn.addEventListener("click", handleCartClick);
  }

  function handleCartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🛒 Cart button clicked");
    toggleCartSidebar();
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
