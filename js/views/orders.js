// js/views/orders.js
import {
  getAllOrders,
  formatOrderDate,
  getOrderStatus,
  getPaymentMethodText, // TAMBAH INI
  getShippingMethodText, // TAMBAH INI
} from "../services/order-service.js";
import { formatPrice } from "../services/cart-service.js";
import { navigateTo } from "../router.js";

export function loadOrdersPage() {
  console.log("📋 Loading orders page...");

  const app = document.getElementById("app");
  const orders = getAllOrders();

  app.innerHTML = `
    <div class="orders-page">
      <div class="page-header">
        <h1><i class="fas fa-history"></i> Riwayat Pesanan</h1>
        <p>Lihat semua pesanan yang telah Anda buat</p>
      </div>
      
      <div class="page-actions">
        <button class="btn-back" onclick="window.history.back()">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
      </div>
      
      <div class="orders-content">
        ${orders.length === 0 ? renderEmptyState() : renderOrdersList(orders)}
      </div>
    </div>
  `;

  if (orders.length > 0) {
    setupOrderCardEvents();
  }
}

// ==================== RENDER FUNCTIONS ====================

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-shopping-bag"></i>
      </div>
      <h3>Belum ada transaksi</h3>
      <p>Silakan lakukan pemesanan terlebih dahulu untuk melihat riwayat di sini.</p>
      <div class="empty-actions">
        <a href="#products" class="btn btn-primary">
          <i class="fas fa-shopping-cart"></i> Mulai Belanja
        </a>
        <a href="#home" class="btn btn-outline">
          <i class="fas fa-home"></i> Kembali ke Beranda
        </a>
      </div>
    </div>
  `;
}

function renderOrdersList(orders) {
  return `
    <div class="orders-list">
      ${orders.map((order) => renderOrderCard(order)).join("")}
    </div>
  `;
}

function renderOrderCard(order) {
  const status = getOrderStatus(order);
  const orderDate = formatOrderDate(order.orderDate);
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <div class="order-card" data-order-id="${order.orderId}">
      <div class="order-card-header">
        <div class="order-info">
          <span class="order-id">
            <i class="fas fa-receipt"></i> ${order.orderId}
          </span>
          <span class="order-date">
            <i class="fas fa-calendar"></i> ${orderDate}
          </span>
        </div>
        <span class="order-status" style="color: ${status.color}; background: ${
    status.color
  }20">
          <i class="fas fa-circle"></i> ${status.text}
        </span>
      </div>
      
      <div class="order-card-body">
        <div class="order-customer">
          <i class="fas fa-user"></i>
          <span>${order.customer.name}</span>
          <span class="customer-email">(${order.customer.email})</span>
        </div>
        
        <div class="order-summary">
          <div class="order-items-preview">
            <i class="fas fa-box"></i>
            <span class="items-count">${itemsCount} item</span>
            ${order.items
              .slice(0, 2)
              .map(
                (item) => `
              <span class="order-item-preview">${item.name} × ${item.quantity}</span>
            `
              )
              .join("")}
            ${
              order.items.length > 2
                ? `<span class="more-items">+${
                    order.items.length - 2
                  } lainnya</span>`
                : ""
            }
          </div>
          
          <div class="order-total">
            <span>Total:</span>
            <strong>${formatPrice(order.total)}</strong>
          </div>
        </div>
        
        <div class="order-meta">
          <span class="meta-item">
            <i class="fas fa-shipping-fast"></i>
            ${getShippingMethodText(order.shipping)}
          </span>
          <span class="meta-item">
            <i class="fas fa-credit-card"></i>
            ${getPaymentMethodText(order.payment)}
          </span>
        </div>
      </div>
      
      <div class="order-card-footer">
        <button class="btn btn-outline view-order-btn" data-order-id="${
          order.orderId
        }">
          <i class="fas fa-eye"></i> Lihat Detail
        </button>
        <button class="btn btn-secondary reorder-btn" data-order-id="${
          order.orderId
        }">
          <i class="fas fa-redo"></i> Pesan Lagi
        </button>
      </div>
    </div>
  `;
}

// ==================== EVENT HANDLERS ====================

function setupOrderCardEvents() {
  document.querySelectorAll(".view-order-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const orderId = e.target.closest(".view-order-btn").dataset.orderId;
      navigateTo(`#order-detail/${orderId}`);
    });
  });

  document.querySelectorAll(".reorder-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const orderId = e.target.closest(".reorder-btn").dataset.orderId;
      console.log(`🔄 Reordering: ${orderId}`);
      alert(`Fitur "Pesan Lagi" untuk order ${orderId} akan segera tersedia!`);
    });
  });

  document.querySelectorAll(".order-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const orderId = card.dataset.orderId;
      navigateTo(`#order-detail/${orderId}`);
    });
  });
}

// ==================== TIDAK PERLU UTILITIES LAGI ====================
// HAPUS SEMUA FUNCTION DI BAWAH INI KARENA SUDAH DI IMPORT DARI order-service.js
