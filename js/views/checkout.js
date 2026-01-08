// js/views/checkout.js
import {
  getCart,
  getCartTotal,
  clearCart,
  formatPrice,
  removeMultipleFromCart,
} from "../services/cart-service.js";
import { navigateTo } from "../router.js";

let checkoutForm = null;

export function loadCheckoutPage() {
  console.log("💰 Loading checkout page...");

  const app = document.getElementById("app");

  // AMBIL ITEMS YANG DIPILIH (atau semua kalo gaada selected)
  const selectedIds = JSON.parse(
    localStorage.getItem("bakule_kembang_selected_items") || "[]"
  );

  let items;
  if (selectedIds.length > 0) {
    // Hanya tampilkan items yang dipilih
    items = getCart().filter((item) => selectedIds.includes(item.id));
    console.log(`🛒 Checkout dengan ${items.length} produk terpilih`);
  } else {
    // Normal checkout (semua items)
    items = getCart();
  }

  if (items.length === 0) {
    alert("Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.");
    navigateTo("#cart");
    return;
  }

  // GUNAKAN FUNGSI BARU UNTUK TOTAL
  const total =
    selectedIds.length > 0
      ? items.reduce((total, item) => total + item.price * item.quantity, 0)
      : getCartTotal();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Render checkout page dengan items yang sudah difilter
  app.innerHTML = `
    <div class="checkout-page" id="checkout-page">
      <div class="checkout-container">
        <!-- HEADER - TAMBAH INDIKATOR SELECTED -->
        <div class="checkout-header">
          <h1><i class="fas fa-credit-card"></i> Checkout</h1>
          <p>Langkah terakhir untuk mendapatkan bunga indah Anda</p>
          ${
            selectedIds.length > 0
              ? `<div class="selected-notice">
              <i class="fas fa-check-circle"></i>
              Checkout ${selectedIds.length} produk terpilih
            </div>`
              : ""
          }
        </div>

        <div class="checkout-content">
          <!-- LEFT: FORM -->
          <div class="checkout-form-section">
            <form id="checkout-form">
              <!-- INFORMASI PENGIRIMAN -->
              <div class="form-section">
                <h3><i class="fas fa-user"></i> Informasi Penerima</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">Nama Lengkap *</label>
                    <input type="text" id="name" name="name" required placeholder="Masukkan nama lengkap">
                  </div>
                  <div class="form-group">
                    <label for="phone">Nomor Telepon *</label>
                    <input type="tel" id="phone" name="phone" required placeholder="Contoh: 081234567890">
                  </div>
                </div>

                <div class="form-group">
                  <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required placeholder="email@contoh.com">
                </div>

                <div class="form-group">
                  <label for="address">Alamat Lengkap *</label>
                  <textarea id="address" name="address" rows="3" required placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">Kota *</label>
                    <input type="text" id="city" name="city" required placeholder="Nama kota">
                  </div>
                  <div class="form-group">
                    <label for="postal">Kode Pos *</label>
                    <input type="text" id="postal" name="postal" required placeholder="5 digit kode pos">
                  </div>
                </div>
              </div>

              <!-- METODE PENGIRIMAN -->
              <div class="form-section">
                <h3><i class="fas fa-shipping-fast"></i> Metode Pengiriman</h3>
                
                <div class="shipping-options">
                  <label class="shipping-option">
                    <input type="radio" name="shipping" value="regular" checked>
                    <div class="option-content">
                      <span class="option-title">Reguler (3-5 hari)</span>
                      <span class="option-price">Gratis</span>
                    </div>
                  </label>

                  <label class="shipping-option">
                    <input type="radio" name="shipping" value="express">
                    <div class="option-content">
                      <span class="option-title">Express (1-2 hari)</span>
                      <span class="option-price">Rp 25.000</span>
                    </div>
                  </label>

                  <label class="shipping-option">
                    <input type="radio" name="shipping" value="same-day">
                    <div class="option-content">
                      <span class="option-title">Same Day (Hari ini)</span>
                      <span class="option-price">Rp 50.000</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- METODE PEMBAYARAN -->
              <div class="form-section">
                <h3><i class="fas fa-wallet"></i> Metode Pembayaran</h3>
                
                <div class="payment-options">
                  <label class="payment-option">
                    <input type="radio" name="payment" value="bank-transfer" checked>
                    <i class="fas fa-university"></i>
                    <span>Transfer Bank</span>
                  </label>

                  <label class="payment-option">
                    <input type="radio" name="payment" value="credit-card">
                    <i class="fas fa-credit-card"></i>
                    <span>Kartu Kredit</span>
                  </label>

                  <label class="payment-option">
                    <input type="radio" name="payment" value="e-wallet">
                    <i class="fas fa-mobile-alt"></i>
                    <span>E-Wallet</span>
                  </label>

                  <label class="payment-option">
                    <input type="radio" name="payment" value="cod">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Bayar di Tempat (COD)</span>
                  </label>
                </div>
              </div>

              <!-- CATATAN (OPTIONAL) -->
              <div class="form-section">
                <h3><i class="fas fa-sticky-note"></i> Catatan (Opsional)</h3>
                <div class="form-group">
                  <textarea id="notes" name="notes" rows="2" placeholder="Contoh: Kirim sebelum jam 3 sore, atau tambahkan kartu ucapan..."></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- RIGHT: ORDER SUMMARY -->
          <div class="order-summary-section">
            <div class="order-summary-card">
              <h3>Ringkasan Pesanan</h3>
              
              <div class="order-items">
                ${items
                  .map(
                    (item) => `
                  <div class="order-item">
                    <div class="item-info">
                      <span class="item-name">${item.name} × ${
                      item.quantity
                    }</span>
                      <span class="item-price">${formatPrice(
                        item.price * item.quantity
                      )}</span>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>

              <div class="order-summary-details">
                <div class="summary-row">
                  <span>Subtotal (${itemCount} produk)</span>
                  <span>${formatPrice(total)}</span>
                </div>
                <div class="summary-row">
                  <span>Pengiriman</span>
                  <span id="shipping-cost">Gratis</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <strong>Total Pembayaran</strong>
                  <strong class="total-price" id="total-price">${formatPrice(
                    total
                  )}</strong>
                </div>
              </div>

              <div class="terms-agreement">
                <label class="checkbox-label">
                  <input type="checkbox" id="agree-terms" required>
                  <span>Saya menyetujui <a href="#" class="terms-link">Syarat & Ketentuan</a> yang berlaku</span>
                </label>
              </div>

              <button type="submit" form="checkout-form" class="btn btn-primary btn-block btn-lg" id="place-order-btn">
                <i class="fas fa-lock"></i> Bayar Sekarang
              </button>

              <p class="security-note">
                <i class="fas fa-shield-alt"></i> Transaksi Anda aman dan terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize checkout page
  initializeCheckoutPage();
}

function getCurrentCheckoutTotal() {
  const selectedIds = JSON.parse(
    localStorage.getItem("bakule_kembang_selected_items") || "[]"
  );

  if (selectedIds.length > 0) {
    const selectedItems = getCart().filter((item) =>
      selectedIds.includes(item.id)
    );
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  return getCartTotal();
}

function initializeCheckoutPage() {
  console.log("🔧 Initializing checkout page...");

  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Simpan reference form
  checkoutForm = form;

  // Update total saat shipping berubah
  const shippingInputs = document.querySelectorAll('input[name="shipping"]');
  shippingInputs.forEach((input) => {
    input.addEventListener("change", updateOrderTotal);
  });

  // Handle form submission
  form.addEventListener("submit", handleOrderSubmit);

  // Initialize total
  updateOrderTotal();

  console.log("✅ Checkout page initialized");
}

function updateOrderTotal() {
  const cartTotal = getCurrentCheckoutTotal(); // <-- PAKAI HELPER FUNCTION
  const shippingCost = getSelectedShippingCost();
  const total = cartTotal + shippingCost;

  // Update UI
  const shippingCostEl = document.getElementById("shipping-cost");
  const totalPriceEl = document.getElementById("total-price");

  if (shippingCostEl) {
    shippingCostEl.textContent =
      shippingCost === 0 ? "Gratis" : formatPrice(shippingCost);
  }

  if (totalPriceEl) {
    totalPriceEl.textContent = formatPrice(total);
  }
}

function getSelectedShippingCost() {
  const selectedShipping = document.querySelector(
    'input[name="shipping"]:checked'
  );
  if (!selectedShipping) return 0;

  switch (selectedShipping.value) {
    case "express":
      return 25000;
    case "same-day":
      return 50000;
    default:
      return 0; // regular
  }
}

function handleOrderSubmit(e) {
  e.preventDefault();
  console.log("🔄 Processing order...");

  // Validasi form
  if (!validateCheckoutForm()) {
    return;
  }

  // Ambil data form
  const formData = new FormData(checkoutForm);

  // Ambil items yang dipilih (atau semua)
  const selectedIds = JSON.parse(
    localStorage.getItem("bakule_kembang_selected_items") || "[]"
  );

  let orderItems;
  if (selectedIds.length > 0) {
    orderItems = getCart().filter((item) => selectedIds.includes(item.id));
  } else {
    orderItems = getCart();
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = getSelectedShippingCost();
  const total = subtotal + shippingCost;

  const orderData = {
    customer: {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      postal: formData.get("postal"),
    },
    shipping: formData.get("shipping"),
    payment: formData.get("payment"),
    notes: formData.get("notes") || "",
    items: orderItems,
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
    orderDate: new Date().toISOString(),
    orderId: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    isPartialCheckout: selectedIds.length > 0,
  };

  // Simpan order ke localStorage
  saveOrder(orderData);

  // HAPUS ITEMS YANG DIPILIH SAJA DARI CART
  if (selectedIds.length > 0) {
    // Hapus hanya items yang dipilih dari cart
    removeMultipleFromCart(selectedIds);
  } else {
    // Normal checkout: clear semua cart
    clearCart();
  }

  // Clear selected items dari localStorage
  localStorage.removeItem("bakule_kembang_selected_items");

  // Redirect ke halaman sukses
  alert(`🎉 Order berhasil! No. Order: ${orderData.orderId}`);
  navigateTo("#home");
}

function validateCheckoutForm() {
  const termsChecked = document.getElementById("agree-terms").checked;
  if (!termsChecked) {
    alert("Anda harus menyetujui Syarat & Ketentuan terlebih dahulu.");
    return false;
  }

  // Validasi form fields (bisa ditambah lebih lengkap)
  const requiredFields = [
    "name",
    "phone",
    "email",
    "address",
    "city",
    "postal",
  ];
  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      alert(
        `Harap lengkapi field: ${field.previousElementSibling.textContent}`
      );
      field.focus();
      return false;
    }
  }

  return true;
}

function saveOrder(orderData) {
  // Simpan ke localStorage
  const orders =
    JSON.parse(localStorage.getItem("bakule_kembang_orders")) || [];
  orders.push(orderData);
  localStorage.setItem("bakule_kembang_orders", JSON.stringify(orders));

  console.log("💾 Order saved:", orderData.orderId);
}
