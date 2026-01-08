// js/views/order-detail.js
import {
  getOrderById,
  formatOrderDate,
  getOrderStatus,
  getPaymentMethodText,
  getShippingMethodText,
} from "../services/order-service.js";
import { formatPrice } from "../services/cart-service.js";
import { navigateTo } from "../router.js";

export function loadOrderDetailPage(orderId) {
  console.log(`📄 Loading order detail: ${orderId}`);

  const app = document.getElementById("app");
  const order = getOrderById(orderId);

  // Jika order tidak ditemukan
  if (!order) {
    app.innerHTML = `
      <div class="order-not-found">
        <div class="not-found-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2>Order Tidak Ditemukan</h2>
        <p>Order dengan ID <strong>${orderId}</strong> tidak ditemukan.</p>
        <div class="action-buttons">
          <button class="btn btn-outline" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Kembali
          </button>
          <a href="#orders" class="btn btn-primary">
            <i class="fas fa-history"></i> Lihat Riwayat
          </a>
        </div>
      </div>
    `;
    return;
  }

  const status = getOrderStatus(order);
  const orderDate = formatOrderDate(order.orderDate);

  app.innerHTML = `
    <div class="order-detail-page">
      <!-- HEADER -->
      <div class="order-detail-header">
        <button class="btn-back" onclick="window.history.back()">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <h1><i class="fas fa-file-alt"></i> Detail Pesanan</h1>
        <div class="header-actions">
          <button class="btn-icon" title="Cetak" onclick="window.print()">
            <i class="fas fa-print"></i>
          </button>
          <button class="btn-icon" title="Bagikan" id="share-order-btn">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      
      <!-- STATUS BANNER -->
      <div class="order-status-banner" style="background: ${
        status.color
      }20; border-left: 4px solid ${status.color}">
        <div class="status-content">
          <i class="fas fa-circle" style="color: ${status.color}"></i>
          <div>
            <h3 style="color: ${status.color}">${status.text}</h3>
            <p>Order ID: <strong>${order.orderId}</strong> • ${orderDate}</p>
          </div>
        </div>
      </div>
      
      <div class="order-detail-container">
        <!-- INFORMASI PESANAN -->
        <div class="detail-section">
          <h2 class="section-title">
            <i class="fas fa-info-circle"></i> Informasi Pesanan
          </h2>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">No. Order</span>
              <span class="detail-value">${order.orderId}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tanggal Order</span>
              <span class="detail-value">${orderDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value status-badge" style="color: ${
                status.color
              }; background: ${status.color}15">
                <i class="fas fa-circle"></i> ${status.text}
              </span>
            </div>
          </div>
        </div>
        
        <!-- INFORMASI PENERIMA -->
        <div class="detail-section">
          <h2 class="section-title">
            <i class="fas fa-user"></i> Informasi Penerima
          </h2>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Nama Lengkap</span>
              <span class="detail-value">${order.customer.name}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">${order.customer.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">No. Telepon</span>
              <span class="detail-value">${order.customer.phone}</span>
            </div>
            <div class="detail-item full-width">
              <span class="detail-label">Alamat Lengkap</span>
              <span class="detail-value">
                ${order.customer.address}, ${order.customer.city} ${
    order.customer.postal
  }
              </span>
            </div>
          </div>
        </div>
        
        <!-- INFORMASI PENGIRIMAN -->
        <div class="detail-section">
          <h2 class="section-title">
            <i class="fas fa-shipping-fast"></i> Pengiriman
          </h2>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Metode Pengiriman</span>
              <span class="detail-value">${getShippingMethodText(
                order.shipping
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estimasi Tiba</span>
              <span class="detail-value">${getShippingEstimateText(
                order.shipping
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Biaya Pengiriman</span>
              <span class="detail-value">${
                order.shippingCost === 0
                  ? "Gratis"
                  : formatPrice(order.shippingCost)
              }</span>
            </div>
          </div>
        </div>
        
        <!-- INFORMASI PEMBAYARAN -->
        <div class="detail-section">
          <h2 class="section-title">
            <i class="fas fa-credit-card"></i> Pembayaran
          </h2>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Metode Pembayaran</span>
              <span class="detail-value">${getPaymentMethodText(
                order.payment
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status Pembayaran</span>
              <span class="detail-value status-badge" style="color: #4CAF50; background: #4CAF5015">
                <i class="fas fa-check-circle"></i> Lunas
              </span>
            </div>
          </div>
        </div>
        
        <!-- PRODUK YANG DIPESAN -->
        <div class="detail-section">
          <h2 class="section-title">
            <i class="fas fa-shopping-cart"></i> Produk Dipesan
            <span class="item-count">(${order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            )} item)</span>
          </h2>
          
          <div class="order-items-container">
            ${order.items.map((item) => renderOrderItem(item)).join("")}
            
            <!-- RINGKASAN TOTAL -->
            <div class="order-total-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(order.subtotal)}</span>
              </div>
              <div class="summary-row">
                <span>Biaya Pengiriman</span>
                <span>${
                  order.shippingCost === 0
                    ? "Gratis"
                    : formatPrice(order.shippingCost)
                }</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <strong>Total Pembayaran</strong>
                <strong>${formatPrice(order.total)}</strong>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CATATAN -->
        ${
          order.notes
            ? `
          <div class="detail-section">
            <h2 class="section-title">
              <i class="fas fa-sticky-note"></i> Catatan Pesanan
            </h2>
            <div class="order-notes">
              <p>"${order.notes}"</p>
            </div>
          </div>
        `
            : ""
        }
        
        <!-- TOMBOL AKSI -->
        <div class="action-buttons">
          <button class="btn btn-outline" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Kembali
          </button>
          <button class="btn btn-secondary" id="reorder-detail-btn" data-order-id="${
            order.orderId
          }">
            <i class="fas fa-redo"></i> Pesan Lagi
          </button>
          <button class="btn btn-primary" onclick="window.print()">
            <i class="fas fa-print"></i> Cetak Invoice
          </button>
        </div>
        
        <!-- FOOTNOTE -->
        <div class="order-footnote">
          <p>
            <i class="fas fa-info-circle"></i>
            Butuh bantuan dengan pesanan ini? 
            <a href="#contact" class="contact-link">Hubungi Customer Service</a>
          </p>
        </div>
      </div>
    </div>
  `;

  // Setup event listeners
  setupOrderDetailEvents(order);
}

// ==================== RENDER FUNCTIONS ====================

function renderOrderItem(item) {
  const itemTotal = item.price * item.quantity;

  return `
    <div class="order-item-detail">
      <div class="item-image">
        <div class="image-placeholder">
          <i class="fas fa-flower"></i>
        </div>
      </div>
      <div class="item-info">
        <h4 class="item-name">${item.name}</h4>
        <div class="item-meta">
          <span class="item-quantity">Jumlah: ${item.quantity}</span>
          <span class="item-price">${formatPrice(item.price)} per item</span>
        </div>
        ${
          item.category
            ? `<span class="item-category">${item.category}</span>`
            : ""
        }
      </div>
      <div class="item-total">
        <span>${formatPrice(itemTotal)}</span>
      </div>
    </div>
  `;
}

// ==================== HELPER FUNCTIONS ====================

function getShippingEstimateText(shippingCode) {
  switch (shippingCode) {
    case "express":
      return "1-2 hari kerja";
    case "same-day":
      return "Hari ini (jika order sebelum jam 14:00)";
    default:
      return "3-5 hari kerja";
  }
}

// ==================== EVENT HANDLERS ====================

function setupOrderDetailEvents(order) {
  // Share button
  const shareBtn = document.getElementById("share-order-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      shareOrder(order);
    });
  }

  // Reorder button
  const reorderBtn = document.getElementById("reorder-detail-btn");
  if (reorderBtn) {
    reorderBtn.addEventListener("click", () => {
      handleReorder(order);
    });
  }
}

function shareOrder(order) {
  const shareText =
    `Saya baru saja memesan bunga dari Bakule Kembang!\n\n` +
    `Order ID: ${order.orderId}\n` +
    `Total: ${formatPrice(order.total)}\n` +
    `Status: ${getOrderStatus(order).text}\n\n` +
    `Lihat detail: ${window.location.href}`;

  if (navigator.share) {
    navigator
      .share({
        title: `Order Bakule Kembang - ${order.orderId}`,
        text: shareText,
        url: window.location.href,
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        copyToClipboard(shareText);
      });
  } else {
    copyToClipboard(shareText);
    alert("Detail order telah disalin ke clipboard!");
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    });
}

function handleReorder(order) {
  console.log(`🔄 Reordering: ${order.orderId}`);

  // Confirm dengan user
  if (
    confirm(`Tambahkan ${order.items.length} item dari order ini ke keranjang?`)
  ) {
    // TODO: Implement add to cart logic
    // For now, just show message
    alert(
      `Fitur "Pesan Lagi" akan segera tersedia!\n\n` +
        `Order ${order.orderId} berisi:\n` +
        order.items
          .map((item) => `- ${item.name} × ${item.quantity}`)
          .join("\n")
    );
  }
}
