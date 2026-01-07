import { products } from "../data/products.js";
import { addToCart } from "../services/cart-service.js";
import {
  categories,
  flowerTypes,
  priceRanges,
  colors,
  tags,
  sortOptions,
  getAllFilterValues,
} from "../data/categories.js";

import {
  filterProducts,
  sortProducts,
  getFilteredAndSortedProducts,
} from "../services/product-service.js";

import { renderProductCards } from "../components/product-card.js";

function getQueryParams() {
  const params = {};
  const hash = window.location.hash;

  // Cari bagian setelah ?
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return params;

  const queryString = hash.substring(queryIndex + 1);

  if (queryString) {
    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
  }

  console.log("📦 Query params from URL:", params);
  return params;
}

let currentFilters = {
  category: [],
  flowerType: [],
  priceRange: null,
  colors: [],
  tags: [],
  featuredOnly: false,
  inStockOnly: true,
  searchKeyword: "",
};

let currentSort = "featured";
let filteredProducts = [...products];

export function loadProductsPage() {
  console.log("🌷 Loading products page...");

  const queryParams = getQueryParams();

  const savedFilter = sessionStorage.getItem("categoryFilter");

  // Reset filters dulu
  currentFilters = {
    category: [],
    flowerType: [],
    priceRange: null,
    colors: [],
    tags: [],
    featuredOnly: false,
    inStockOnly: true,
    searchKeyword: "",
  };

  if (queryParams.category) {
    currentFilters.category = [queryParams.category];
    console.log(`🔍 Filtering by URL category: ${queryParams.category}`);
  }
  if (queryParams.flowerType) {
    currentFilters.flowerType = [queryParams.flowerType];
    console.log(`🔍 Filtering by URL flower type: ${queryParams.flowerType}`);
  }
  if (queryParams.priceRange) {
    const range = priceRanges.find((r) => r.id === queryParams.priceRange);
    if (range) {
      currentFilters.priceRange = range;
      console.log(`🔍 Filtering by URL price range: ${range.name}`);
    }
  }
  if (queryParams.featured === "true") {
    currentFilters.featuredOnly = true;
    console.log(`🔍 Filtering by URL featured only`);
  }

  // Priority 2: SessionStorage (jika gak ada dari URL)
  if (savedFilter && Object.keys(queryParams).length === 0) {
    try {
      const filter = JSON.parse(savedFilter);
      console.log("🔍 Applying saved filter from sessionStorage:", filter);

      switch (filter.type) {
        case "category":
          currentFilters.category = [filter.value];
          console.log(`✅ Set category filter: ${filter.value}`);
          break;

        case "flowerType":
          currentFilters.flowerType = [filter.value];
          console.log(`✅ Set flower type filter: ${filter.value}`);
          break;

        case "priceRange":
          const range = priceRanges.find((r) => r.id === filter.value);
          if (range) {
            currentFilters.priceRange = range;
            console.log(`✅ Set price range filter: ${range.name}`);
          }
          break;

        case "featured":
          currentFilters.featuredOnly = true;
          console.log(`✅ Set featured filter`);
          break;
      }
    } catch (error) {
      console.error("❌ Error parsing saved filter:", error);
    }
  }
  // ========== END FILTER CHECK ==========

  // Clear sessionStorage setelah dipakai
  if (savedFilter) {
    sessionStorage.removeItem("categoryFilter");
    console.log("🧹 Cleared saved filter from sessionStorage");
  }

  const app = document.getElementById("app");

  filteredProducts = getFilteredAndSortedProducts(currentFilters, currentSort);

  app.innerHTML = `
    <div class="products-page">
      ${renderHeader()}
      ${renderFiltersToggle()}
      ${renderActiveFilters()}
      <div class="products-container">
        ${renderSidebarFilters()}
        ${renderMainContent()}
      </div>
    </div>
    <div class="sidebar-overlay"></div>
  `;

  initializeProductsPage();
}

function renderHeader() {
  let title = "🌷 Semua Produk Bunga";
  let subtitle =
    "Temukan bunga terbaik untuk setiap momen spesial dalam hidup Anda";

  // Cek filter yang aktif
  if (currentFilters.category.length > 0) {
    const cat = categories.find((c) => c.id === currentFilters.category[0]);
    if (cat) {
      title = `${cat.icon} Produk ${cat.name}`;
      subtitle = `Koleksi ${cat.description || cat.name} terbaik kami`;
    }
  } else if (currentFilters.flowerType.length > 0) {
    const flower = flowerTypes.find(
      (f) => f.id === currentFilters.flowerType[0]
    );
    if (flower) {
      title = `${flower.icon} Bunga ${flower.name}`;
      subtitle = `Koleksi bunga ${flower.name} pilihan terbaik`;
    }
  } else if (currentFilters.priceRange) {
    title = `💰 ${currentFilters.priceRange.name}`;
    subtitle = `Produk bunga dengan harga ${currentFilters.priceRange.name.toLowerCase()}`;
  } else if (currentFilters.featuredOnly) {
    title = "⭐ Produk Unggulan";
    subtitle = "Koleksi bunga pilihan terbaik kami";
  }

  return `
    <div class="page-header">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
  `;
}

function renderFiltersToggle() {
  return `
    <button class="filters-toggle" id="filters-toggle">
      <i class="fas fa-filter"></i> Filter Produk
      <span class="filter-count" id="filter-count">0</span>
    </button>
  `;
}

function renderActiveFilters() {
  const activeFilters = getActiveFiltersArray();

  if (activeFilters.length === 0) return "";

  return `
    <div class="active-filters" id="active-filters">
      ${activeFilters
        .map(
          (filter) => `
        <div class="active-filter" data-type="${filter.type}" data-value="${
            filter.value
          }">
          ${filter.icon || ""} ${filter.label}
          <button class="remove-filter" data-type="${
            filter.type
          }" data-value="${filter.value}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `
        )
        .join("")}
      <button class="clear-filters" id="clear-all-filters">
        <i class="fas fa-trash-alt"></i> Hapus Semua
      </button>
    </div>
  `;
}

function renderSidebarFilters() {
  const filterData = getAllFilterValues();

  return `
    <aside class="filters-sidebar" id="filters-sidebar">
      <div class="filters-header">
        <h2><i class="fas fa-filter"></i> Filter</h2>
        <button class="clear-filters" id="clear-filters">
          <i class="fas fa-undo"></i> Reset
        </button>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-search"></i> Cari Produk</h3>
        <div class="search-container">
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Cari bunga, warna, atau tag..."
            value="${currentFilters.searchKeyword}"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-layer-group"></i> Kategori</h3>
        <div class="filter-options">
          ${filterData.categories
            .map(
              (cat) => `
            <label class="filter-option">
              <input 
                type="checkbox" 
                name="category" 
                value="${cat.id}" 
                ${currentFilters.category.includes(cat.id) ? "checked" : ""}
              >
              <span class="filter-label">
                ${cat.icon} ${cat.name}
                <span class="filter-count">${cat.count}</span>
              </span>
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-leaf"></i> Jenis Bunga</h3>
        <div class="filter-options">
          ${filterData.flowerTypes
            .map(
              (type) => `
            <label class="filter-option">
              <input 
                type="checkbox" 
                name="flowerType" 
                value="${type.id}" 
                ${currentFilters.flowerType.includes(type.id) ? "checked" : ""}
              >
              <span class="filter-label">
                ${type.icon} ${type.name}
                <span class="filter-count">${type.count}</span>
              </span>
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-tag"></i> Rentang Harga</h3>
        <div class="filter-options">
          ${filterData.priceRanges
            .map(
              (range) => `
            <label class="filter-option">
              <input 
                type="radio" 
                name="priceRange" 
                value="${range.id}" 
                ${currentFilters.priceRange?.id === range.id ? "checked" : ""}
              >
              <span class="filter-label">
                ${range.name}
                <span class="filter-count">${range.count}</span>
              </span>
            </label>
          `
            )
            .join("")}
        </div>
        
        <div class="price-range">
          <div class="price-inputs">
            <div class="price-input-group">
              <span>Rp</span>
              <input type="number" id="min-price" placeholder="Min" min="0" value="0">
            </div>
            <span>-</span>
            <div class="price-input-group">
              <span>Rp</span>
              <input type="number" id="max-price" placeholder="Max" min="0" value="250000">
            </div>
          </div>
          <input type="range" id="price-slider" class="price-slider" min="0" max="250000" step="10000" value="250000">
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-palette"></i> Warna</h3>
        <div class="color-chips">
          ${filterData.colors
            .map(
              (color) => `
            <div 
              class="color-chip ${
                currentFilters.colors.includes(color.name) ? "selected" : ""
              }" 
              style="background-color: ${getColorCode(color.name)}"
              title="${color.name}"
              data-color="${color.name}"
            ></div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-tags"></i> Tag</h3>
        <div class="tags-container">
          ${filterData.tags
            .map(
              (tag) => `
            <button 
              class="tag-filter ${
                currentFilters.tags.includes(tag.name) ? "selected" : ""
              }"
              data-tag="${tag.name}"
            >
              ${tag.name} <span class="filter-count">${tag.count}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="filter-section">
        <h3><i class="fas fa-star"></i> Lainnya</h3>
        <div class="filter-options">
          <label class="filter-option">
            <input 
              type="checkbox" 
              name="featuredOnly" 
              ${currentFilters.featuredOnly ? "checked" : ""}
            >
            <span class="filter-label">
              ⭐ Produk Unggulan
              <span class="filter-count">${
                filterData.featuredFilter.count
              }</span>
            </span>
          </label>
          
          <label class="filter-option">
            <input 
              type="checkbox" 
              name="inStockOnly" 
              ${currentFilters.inStockOnly ? "checked" : ""}
            >
            <span class="filter-label">
              📦 Stok Tersedia
            </span>
          </label>
        </div>
      </div>
    </aside>
  `;
}

function renderMainContent() {
  return `
    <main class="products-main">
      <div class="products-toolbar">
        <div class="search-container">
          <input 
            type="text" 
            id="main-search" 
            class="search-input" 
            placeholder="Cari produk bunga..."
            value="${currentFilters.searchKeyword}"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="sort-container">
          <span class="sort-label">Urutkan:</span>
          <select id="sort-select" class="sort-select">
            ${sortOptions
              .map(
                (option) => `
              <option value="${option.id}" ${
                  currentSort === option.id ? "selected" : ""
                }>
                ${option.icon} ${option.name}
              </option>
            `
              )
              .join("")}
          </select>
        </div>
      </div>
      
      <div class="products-stats">
        <p>Menampilkan <strong id="products-count">${
          filteredProducts.length
        }</strong> dari ${products.length} produk</p>
      </div>
      
      <div class="products-grid" id="products-grid"></div>
      
      <div class="no-products hidden" id="no-products">
        <i class="fas fa-search fa-3x"></i>
        <h3>Tidak ada produk yang ditemukan</h3>
        <p>Coba gunakan filter yang berbeda atau kata kunci lain</p>
      </div>
    </main>
  `;
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

function getActiveFiltersArray() {
  const active = [];

  currentFilters.category.forEach((catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      active.push({
        type: "category",
        value: catId,
        label: cat.name,
        icon: cat.icon,
      });
    }
  });

  currentFilters.flowerType.forEach((typeId) => {
    const type = flowerTypes.find((t) => t.id === typeId);
    if (type) {
      active.push({
        type: "flowerType",
        value: typeId,
        label: type.name,
        icon: type.icon,
      });
    }
  });

  if (currentFilters.priceRange) {
    const range = priceRanges.find(
      (r) => r.id === currentFilters.priceRange.id
    );
    if (range) {
      active.push({
        type: "priceRange",
        value: range.id,
        label: range.name,
        icon: "💰",
      });
    }
  }

  currentFilters.colors.forEach((color) => {
    active.push({
      type: "colors",
      value: color,
      label: color,
      icon: "🎨",
    });
  });

  currentFilters.tags.forEach((tag) => {
    active.push({
      type: "tags",
      value: tag,
      label: tag,
      icon: "🏷️",
    });
  });

  if (currentFilters.featuredOnly) {
    active.push({
      type: "featuredOnly",
      value: "true",
      label: "Unggulan",
      icon: "⭐",
    });
  }

  return active;
}

function updateFilterCount() {
  const activeCount = getActiveFiltersArray().length;
  const filterCountEl = document.getElementById("filter-count");
  if (filterCountEl) {
    filterCountEl.textContent = activeCount;
    filterCountEl.style.display = activeCount > 0 ? "inline-block" : "none";
  }
}

function updateProductsDisplay() {
  filteredProducts = getFilteredAndSortedProducts(currentFilters, currentSort);

  const countEl = document.getElementById("products-count");
  if (countEl) {
    countEl.textContent = filteredProducts.length;
  }

  const gridEl = document.getElementById("products-grid");
  const noProductsEl = document.getElementById("no-products");

  if (filteredProducts.length === 0) {
    if (gridEl) gridEl.innerHTML = "";
    if (noProductsEl) noProductsEl.classList.remove("hidden");
  } else {
    if (noProductsEl) noProductsEl.classList.add("hidden");
    if (gridEl) {
      renderProductCards(filteredProducts, gridEl);
    }
  }

  updateActiveFilters();
  updateFilterCount();
}

function updateActiveFilters() {
  const activeFiltersEl = document.getElementById("active-filters");
  const container = document.querySelector(".active-filters")?.parentElement;

  const activeFilters = getActiveFiltersArray();

  if (activeFilters.length > 0) {
    if (!container) {
      const filtersToggle = document.getElementById("filters-toggle");
      if (filtersToggle) {
        filtersToggle.insertAdjacentHTML("afterend", renderActiveFilters());
      }
    } else {
      container.innerHTML = renderActiveFilters();
    }
  } else if (container) {
    container.remove();
  }
}

function setupProductCardEvents() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.stopPropagation();
      const productId = parseInt(this.dataset.id);

      try {
        const { addToCart } = await import("../services/cart-service.js");
        const success = addToCart(productId, 1);

        if (success) {
          const originalHTML = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
          this.classList.add("added");
          this.disabled = true;

          setTimeout(() => {
            this.innerHTML =
              '<i class="fas fa-shopping-cart"></i> Dalam Keranjang';
            this.classList.remove("added");
            this.disabled = false;
          }, 1500);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    });
  });
}

function initializeProductsPage() {
  updateProductsDisplay();
  setupEventListeners();
  setupProductCardEvents();
  console.log("✅ Products page initialized");
}

function setupEventListeners() {
  const filtersToggle = document.getElementById("filters-toggle");
  const filtersSidebar = document.getElementById("filters-sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  if (filtersToggle && filtersSidebar) {
    filtersToggle.addEventListener("click", () => {
      filtersSidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
    });

    sidebarOverlay.addEventListener("click", () => {
      filtersSidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });
  }

  const searchInputs = document.querySelectorAll("#search-input, #main-search");
  searchInputs.forEach((input) => {
    input.addEventListener(
      "input",
      debounce((e) => {
        currentFilters.searchKeyword = e.target.value.trim();
        updateProductsDisplay();
      }, 300)
    );
  });

  document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        currentFilters.category.push(value);
      } else {
        currentFilters.category = currentFilters.category.filter(
          (c) => c !== value
        );
      }
      updateProductsDisplay();
    });
  });

  document.querySelectorAll('input[name="flowerType"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        currentFilters.flowerType.push(value);
      } else {
        currentFilters.flowerType = currentFilters.flowerType.filter(
          (t) => t !== value
        );
      }
      updateProductsDisplay();
    });
  });

  document.querySelectorAll('input[name="priceRange"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        const range = priceRanges.find((r) => r.id === e.target.value);
        currentFilters.priceRange = range;
        updateProductsDisplay();
      }
    });
  });

  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const priceSlider = document.getElementById("price-slider");

  if (minPriceInput && maxPriceInput && priceSlider) {
    minPriceInput.addEventListener("change", (e) => {
      currentFilters.priceRange = {
        id: "custom",
        name: `Rp ${e.target.value} - Rp ${maxPriceInput.value}`,
        min: parseInt(e.target.value) || 0,
        max: parseInt(maxPriceInput.value) || 250000,
      };
      updateProductsDisplay();
    });

    maxPriceInput.addEventListener("change", (e) => {
      currentFilters.priceRange = {
        id: "custom",
        name: `Rp ${minPriceInput.value} - Rp ${e.target.value}`,
        min: parseInt(minPriceInput.value) || 0,
        max: parseInt(e.target.value) || 250000,
      };
      updateProductsDisplay();
    });

    priceSlider.addEventListener("input", (e) => {
      maxPriceInput.value = e.target.value;
      currentFilters.priceRange = {
        id: "custom",
        name: `Rp ${minPriceInput.value} - Rp ${e.target.value}`,
        min: parseInt(minPriceInput.value) || 0,
        max: parseInt(e.target.value),
      };
      updateProductsDisplay();
    });
  }

  document.querySelectorAll(".color-chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      const color = e.target.dataset.color;
      if (currentFilters.colors.includes(color)) {
        currentFilters.colors = currentFilters.colors.filter(
          (c) => c !== color
        );
        e.target.classList.remove("selected");
      } else {
        currentFilters.colors.push(color);
        e.target.classList.add("selected");
      }
      updateProductsDisplay();
    });
  });

  document.querySelectorAll(".tag-filter").forEach((button) => {
    button.addEventListener("click", (e) => {
      const tag = e.target.dataset.tag;
      if (currentFilters.tags.includes(tag)) {
        currentFilters.tags = currentFilters.tags.filter((t) => t !== tag);
        e.target.classList.remove("selected");
      } else {
        currentFilters.tags.push(tag);
        e.target.classList.add("selected");
      }
      updateProductsDisplay();
    });
  });

  document
    .querySelectorAll('input[name="featuredOnly"], input[name="inStockOnly"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        currentFilters[e.target.name] = e.target.checked;
        updateProductsDisplay();
      });
    });

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      updateProductsDisplay();
    });
  }

  document
    .querySelectorAll("#clear-filters, #clear-all-filters")
    .forEach((button) => {
      button.addEventListener("click", () => {
        resetFilters();
        updateProductsDisplay();
      });
    });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".remove-filter")) {
      const button = e.target.closest(".remove-filter");
      const type = button.dataset.type;
      const value = button.dataset.value;

      removeFilter(type, value);
      updateProductsDisplay();
    }
  });
}

function resetFilters() {
  currentFilters = {
    category: [],
    flowerType: [],
    priceRange: null,
    colors: [],
    tags: [],
    featuredOnly: false,
    inStockOnly: true,
    searchKeyword: "",
  };

  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll('input[type="radio"]')
    .forEach((rb) => (rb.checked = false));
  document
    .querySelectorAll(".color-chip")
    .forEach((chip) => chip.classList.remove("selected"));
  document
    .querySelectorAll(".tag-filter")
    .forEach((tag) => tag.classList.remove("selected"));
  document
    .querySelectorAll(".search-input")
    .forEach((input) => (input.value = ""));

  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const priceSlider = document.getElementById("price-slider");

  if (minPriceInput) minPriceInput.value = "0";
  if (maxPriceInput) maxPriceInput.value = "250000";
  if (priceSlider) priceSlider.value = "250000";

  const filtersSidebar = document.getElementById("filters-sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  if (filtersSidebar) filtersSidebar.classList.remove("active");
  if (sidebarOverlay) sidebarOverlay.classList.remove("active");
}

function removeFilter(type, value) {
  switch (type) {
    case "category":
      currentFilters.category = currentFilters.category.filter(
        (c) => c !== value
      );
      const categoryCheckbox = document.querySelector(
        `input[name="category"][value="${value}"]`
      );
      if (categoryCheckbox) {
        categoryCheckbox.checked = false;
      }
      break;

    case "flowerType":
      currentFilters.flowerType = currentFilters.flowerType.filter(
        (t) => t !== value
      );
      const flowerTypeCheckbox = document.querySelector(
        `input[name="flowerType"][value="${value}"]`
      );
      if (flowerTypeCheckbox) {
        flowerTypeCheckbox.checked = false;
      }
      break;

    case "priceRange":
      currentFilters.priceRange = null;
      document
        .querySelectorAll('input[name="priceRange"]')
        .forEach((rb) => (rb.checked = false));
      break;

    case "colors":
      currentFilters.colors = currentFilters.colors.filter((c) => c !== value);
      const colorChip = document.querySelector(
        `.color-chip[data-color="${value}"]`
      );
      if (colorChip) {
        colorChip.classList.remove("selected");
      }
      break;

    case "tags":
      currentFilters.tags = currentFilters.tags.filter((t) => t !== value);
      const tagButton = document.querySelector(
        `.tag-filter[data-tag="${value}"]`
      );
      if (tagButton) {
        tagButton.classList.remove("selected");
      }
      break;

    case "featuredOnly":
      currentFilters.featuredOnly = false;
      const featuredCheckbox = document.querySelector(
        'input[name="featuredOnly"]'
      );
      if (featuredCheckbox) {
        featuredCheckbox.checked = false;
      }
      break;

    case "inStockOnly":
      currentFilters.inStockOnly = true;
      const inStockCheckbox = document.querySelector(
        'input[name="inStockOnly"]'
      );
      if (inStockCheckbox) {
        inStockCheckbox.checked = true;
      }
      break;
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
