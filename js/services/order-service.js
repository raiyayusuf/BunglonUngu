// js/services/order-service.js - SIMPLE VERSION
const ORDERS_KEY = "bakule_kembang_orders";

// 1. Get semua orders
export function getAllOrders() {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
}

// 2. Get order by ID
export function getOrderById(orderId) {
  const orders = getAllOrders();
  return orders.find((order) => order.orderId === orderId);
}

// 3. Save order baru
export function saveOrder(orderData) {
  const orders = getAllOrders();
  orders.unshift(orderData); // Tambah di awal (terbaru)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orderData;
}

// 4. Helper: format tanggal
export function formatOrderDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 5. Helper: get status
export function getOrderStatus(order) {
  const orderDate = new Date(order.orderDate);
  const now = new Date();
  const diffHours = (now - orderDate) / (1000 * 60 * 60);

  if (diffHours < 1) return { text: "Diproses", color: "#2196F3" };
  if (diffHours < 24) return { text: "Dikirim", color: "#FF9800" };
  return { text: "Selesai", color: "#4CAF50" };
}

// 6. Helper: payment method text
export function getPaymentMethodText(code) {
  const methods = {
    "bank-transfer": "Transfer Bank",
    "credit-card": "Kartu Kredit",
    "e-wallet": "E-Wallet",
    cod: "Bayar di Tempat (COD)",
  };
  return methods[code] || code;
}

// 7. Helper: shipping method text
export function getShippingMethodText(code) {
  const methods = {
    express: "Express (1-2 hari)",
    "same-day": "Same Day (Hari ini)",
    regular: "Reguler (3-5 hari)",
  };
  return methods[code] || code;
}
