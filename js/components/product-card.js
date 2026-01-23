// js\components\product-card.js:
import { addToCart } from "../services/cart-service.js";
import { navigateTo } from "../router.js";

function renderColorChips(colors) {
  return colors
    .map(
      (color) =>
        `<span class="color-chip" style="background-color: ${getColorCode(
          color,
        )}" title="${color}"></span>`,
    )
    .join("");
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
    "Multi-color": "linear-gradient(45deg, #ff6b6b, #48dbfb, #1dd1a1)",
  };

  return colorMap[colorName] || "#dfe6e9";
}

export function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-id", product.id);
  card.setAttribute("data-category", product.category);
  card.setAttribute("data-flower-type", product.flowerType);

  const featuredBadge = product.featured
    ? `<span class="product-badge featured">⭐ Unggulan</span>`
    : "";

  const categoryIcons = {
    bouquet: "💐",
    bunch: "🌿",
    bag: "🧺",
  };

  const categoryNames = {
    bouquet: "Buket",
    bunch: "Bunch",
    bag: "Tas",
  };

  const flowerIcons = {
    rose: "🌹",
    tulip: "🌷",
    gerbera: "🌼",
    hydrangea: "💮",
    mixed: "🪷",
  };

  const flowerNames = {
    rose: "Mawar",
    tulip: "Tulip",
    gerbera: "Gerbera",
    hydrangea: "Hydrangea",
    mixed: "Campuran",
  };

  card.innerHTML = `
    <div class="product-image-container">
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="product-image"
        loading="lazy"
        onerror="this.src='assets/image/placeholder.jpg'"
      >
      <div class="product-badges">
        ${featuredBadge}
        <span class="product-badge category">
          ${categoryIcons[product.category] || "🌼"} ${
            categoryNames[product.category] || product.category
          }
        </span>
      </div>
      <button class="quick-view-btn" data-id="${product.id}">
        <i class="fas fa-eye"></i>
      </button>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      
      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">Jenis:</span>
          <span class="meta-value flower-type">
            ${flowerIcons[product.flowerType] || "🌼"} ${
              flowerNames[product.flowerType] || product.flowerType
            }
          </span>
        </div>
        
        <div class="meta-item">
          <span class="meta-label">Warna:</span>
          <span class="meta-value colors">
            ${renderColorChips(product.color)}
          </span>
        </div>
        
        <div class="meta-item tags">
          ${product.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      </div>
      
      <div class="product-footer">
        <div class="price-rating">
          <span class="product-price">Rp ${product.price.toLocaleString(
            "id-ID",
          )}</span>
          <span class="product-rating">
            ⭐ ${product.rating} <small>(${
              Math.floor(Math.random() * 50) + 10
            })</small>
          </span>
        </div>
        
        <div class="product-actions">
          <button class="btn btn-outline view-detail-btn" data-id="${
            product.id
          }">
            <i class="fas fa-info-circle"></i> Detail
          </button>
          <button class="btn btn-primary add-to-cart-btn" data-id="${
            product.id
          }">
            <i class="fas fa-cart-plus"></i> +
          </button>
        </div>
      </div>
    </div>
  `;

  const viewDetailBtn = card.querySelector(".view-detail-btn");
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  const quickViewBtn = card.querySelector(".quick-view-btn");

  if (viewDetailBtn) {
    viewDetailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateTo(`#product/${product.id}`);
    });
  }

  if (addToCartBtn) {
    addToCartBtn.setAttribute("data-action", "add-to-cart");
    addToCartBtn.setAttribute("data-id", product.id);
  }

  if (quickViewBtn) {
    quickViewBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateTo(`#product/${product.id}`);
    });
  }

  card.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      navigateTo(`#product/${product.id}`);
    }
  });

  return card;
}

export function renderProductCards(products, container) {
  console.log("🎨 renderProductCards called, products:", products?.length);

  if (!container) {
    console.error("❌ Container is null!");
    return;
  }

  if (!products || products.length === 0) {
    console.log("📭 No products to render");
    container.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search fa-3x"></i>
        <h3>Tidak ada produk yang ditemukan</h3>
        <p>Coba gunakan filter yang berbeda atau kata kunci lain</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  products.forEach((product) => {
    try {
      const card = createProductCard(product);
      container.appendChild(card);
    } catch (error) {
      console.error("❌ Error creating card for product:", product.id, error);
    }
  });

  console.log("✅ Products rendered:", products.length);
}

export function setupProductCardNavigation() {
  document.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    if (
      productCard &&
      !e.target.closest(".add-to-cart-btn") &&
      !e.target.closest(".quick-view-btn")
    ) {
      const productId = productCard.dataset.id;
      if (productId) {
        // Navigate to product detail
        window.location.hash = `#product/${productId}`;
      }
    }
  });
}
