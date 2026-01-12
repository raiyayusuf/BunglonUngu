// Modal Component - FIXED & ROBUST VERSION
class Modal {
  constructor() {
    this.modalId = "deleteModal";
    this.modalHTML = `
      <div class="modal-overlay" id="${this.modalId}">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Hapus Produk</h3>
          </div>
          <div class="modal-body">
            <p>Apakah Anda yakin ingin menghapus produk ini dari keranjang?</p>
          </div>
          <div class="modal-footer">
            <button class="modal-btn cancel" id="modal-cancel-btn">Batal</button>
            <button class="modal-btn confirm" id="modal-confirm-btn">Hapus</button>
          </div>
        </div>
      </div>
    `;

    this.currentOnConfirm = null;
    this.isInitialized = false;

    // Store references
    this.modal = null;
    this.cancelBtn = null;
    this.confirmBtn = null;
    this.modalContainer = null;

    // Event handlers references for cleanup
    this.eventHandlers = {};
  }

  init() {
    if (this.isInitialized) {
      console.log("🔁 Modal already initialized");
      return;
    }

    console.log("🔧 Modal initializing...");

    // Clean up old modal jika ada
    const oldModal = document.getElementById(this.modalId);
    if (oldModal) oldModal.remove();

    // Cari atau buat modal container
    let modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "modal-container";
      modalContainer.style.cssText = "position: fixed; z-index: 9999;";
      document.body.appendChild(modalContainer);
    }

    // Inject modal HTML
    modalContainer.innerHTML = this.modalHTML;

    // Get element references
    this.modal = document.getElementById(this.modalId);
    this.modalContainer = document.querySelector(".modal-container");
    this.cancelBtn = document.getElementById("modal-cancel-btn");
    this.confirmBtn = document.getElementById("modal-confirm-btn");

    // Validate elements
    if (!this.modal || !this.cancelBtn || !this.confirmBtn) {
      console.error("❌ Modal elements not found!");
      return;
    }

    // Setup events
    this.setupEvents();

    // Mark as initialized
    this.isInitialized = true;

    console.log("✅ Modal initialized successfully");
  }

  setupEvents() {
    console.log("🔧 Setting up modal events...");

    // Clean up old event listeners first
    this.cleanupEvents();

    // Event: Overlay click to close
    this.eventHandlers.overlayClick = (e) => {
      if (e.target === this.modal) {
        console.log("🖱️ Overlay clicked");
        this.close();
      }
    };
    this.modal.addEventListener("click", this.eventHandlers.overlayClick);

    // Event: Cancel button click
    this.eventHandlers.cancelClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🖱️ Cancel button clicked");
      this.close();
    };
    this.cancelBtn.addEventListener("click", this.eventHandlers.cancelClick);

    // Event: Confirm button click
    this.eventHandlers.confirmClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🖱️ Confirm button clicked");

      if (
        this.currentOnConfirm &&
        typeof this.currentOnConfirm === "function"
      ) {
        this.currentOnConfirm();
      }
      this.close();
    };
    this.confirmBtn.addEventListener("click", this.eventHandlers.confirmClick);

    // Event: Escape key to close
    this.eventHandlers.escapeKey = (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        console.log("⌨️ Escape pressed");
        this.close();
      }
    };
    document.addEventListener("keydown", this.eventHandlers.escapeKey);

    // 🔥 FIX: Force pointer cursor and clickable
    this.cancelBtn.style.cursor = "pointer";
    this.confirmBtn.style.cursor = "pointer";
    this.cancelBtn.style.pointerEvents = "auto";
    this.confirmBtn.style.pointerEvents = "auto";

    console.log("✅ Modal events setup complete");
  }

  cleanupEvents() {
    // Remove all event listeners
    if (this.eventHandlers.overlayClick) {
      this.modal?.removeEventListener("click", this.eventHandlers.overlayClick);
    }
    if (this.eventHandlers.cancelClick) {
      this.cancelBtn?.removeEventListener(
        "click",
        this.eventHandlers.cancelClick
      );
    }
    if (this.eventHandlers.confirmClick) {
      this.confirmBtn?.removeEventListener(
        "click",
        this.eventHandlers.confirmClick
      );
    }
    if (this.eventHandlers.escapeKey) {
      document.removeEventListener("keydown", this.eventHandlers.escapeKey);
    }

    // Reset event handlers
    this.eventHandlers = {};
  }

  open(onConfirm, customMessage = null) {
    // Ensure modal is initialized
    if (!this.isInitialized) {
      this.init();
    }

    if (!this.modal || !this.cancelBtn || !this.confirmBtn) {
      console.error("❌ Cannot open modal - elements not ready");
      // Fallback to native confirm
      if (confirm(customMessage || "Hapus produk dari keranjang?")) {
        onConfirm?.();
      }
      return;
    }

    console.log("🟢 Opening modal...");

    // Update message if provided
    if (customMessage && this.modalContainer) {
      const messageEl = this.modalContainer.querySelector(".modal-body p");
      if (messageEl) {
        messageEl.textContent = customMessage;
      }
    }

    // Show modal
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Store callback
    this.currentOnConfirm = onConfirm;

    // 🔥 CRITICAL FIX: Ensure buttons are clickable
    setTimeout(() => {
      this.cancelBtn.style.cursor = "pointer";
      this.confirmBtn.style.cursor = "pointer";
      this.cancelBtn.style.pointerEvents = "auto";
      this.confirmBtn.style.pointerEvents = "auto";
      this.cancelBtn.disabled = false;
      this.confirmBtn.disabled = false;
    }, 10);

    // Focus on cancel button for accessibility
    setTimeout(() => {
      this.cancelBtn.focus();
    }, 50);

    console.log("✅ Modal opened successfully");
  }

  close() {
    console.log("🔴 Closing modal...");

    if (!this.modal) return;

    // Hide modal
    this.modal.classList.remove("active");
    document.body.style.overflow = "";

    // Clear callback
    this.currentOnConfirm = null;

    // Reset message if it was changed
    if (this.modalContainer) {
      const messageEl = this.modalContainer.querySelector(".modal-body p");
      if (messageEl) {
        messageEl.textContent =
          "Apakah Anda yakin ingin menghapus produk ini dari keranjang?";
      }
    }

    console.log("✅ Modal closed");
  }

  destroy() {
    console.log("🗑️ Destroying modal...");
    this.cleanupEvents();

    if (this.modal) {
      this.modal.remove();
    }

    this.isInitialized = false;
    this.modal = null;
    this.cancelBtn = null;
    this.confirmBtn = null;
    this.modalContainer = null;
    this.currentOnConfirm = null;
  }
}

// Export SINGLETON instance
const deleteModal = new Modal();

// Auto-initialize on import
deleteModal.init();

class CheckoutModal {
  constructor() {
    this.modalId = "checkoutModal";
    this.modalHTML = `
      <div class="modal-overlay" id="${this.modalId}">
        <div class="modal-container checkout-modal">
          <button class="modal-close-btn" id="modal-close-btn" aria-label="Tutup">
            &times;
          </button>
          
          <div class="modal-header">
            <div class="modal-icon checkout-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Perhatian</h3>
          </div>
          
          <div class="modal-body">
            <p id="checkout-modal-message">Anda harus menyetujui Syarat & Ketentuan terlebih dahulu.</p>
          </div>
          
          <div class="modal-footer">
            <button class="modal-btn primary" id="checkout-modal-terms-btn">
              <i class="fas fa-file-alt"></i> Lihat Syarat & Ketentuan
            </button>
          </div>
        </div>
      </div>
    `;

    this.currentMessage = "";
    this.isInitialized = false;
    this.modal = null;
    this.eventHandlers = {};
  }

  init() {
    if (this.isInitialized) {
      console.log("🔁 CheckoutModal already initialized");
      return;
    }

    console.log("🔧 CheckoutModal initializing...");

    // Clean up old modal
    const oldModal = document.getElementById(this.modalId);
    if (oldModal) oldModal.remove();

    // Inject to modal container
    let modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "modal-container";
      document.body.appendChild(modalContainer);
    }

    // Add modal HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = this.modalHTML;
    modalContainer.appendChild(tempDiv.firstElementChild);

    // Get elements
    this.modal = document.getElementById(this.modalId);
    this.closeBtn = document.getElementById("modal-close-btn");
    this.termsBtn = document.getElementById("checkout-modal-terms-btn");
    this.okBtn = document.getElementById("checkout-modal-ok-btn");
    this.messageEl = document.getElementById("checkout-modal-message");

    if (!this.modal) {
      console.error("❌ CheckoutModal elements not found!");
      return;
    }

    this.setupEvents();
    this.isInitialized = true;
    console.log("✅ CheckoutModal initialized");
  }

  setupEvents() {
    this.cleanupEvents();

    // Overlay click to close
    this.eventHandlers.overlayClick = (e) => {
      if (e.target === this.modal) this.close();
    };
    this.modal.addEventListener("click", this.eventHandlers.overlayClick);

    // Close button
    this.eventHandlers.closeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    };

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.eventHandlers.closeClick);
      this.closeBtn.style.cursor = "pointer";
      this.closeBtn.style.pointerEvents = "auto";
    }

    // Terms button - BUKA TERMS MODAL!
    this.eventHandlers.termsClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Tutup modal perhatian dulu
      this.close();

      // Buka modal terms setelah delay kecil
      setTimeout(() => {
        termsModal.open();
      }, 300);
    };

    if (this.termsBtn) {
      this.termsBtn.addEventListener("click", this.eventHandlers.termsClick);
      this.termsBtn.style.cursor = "pointer";
      this.termsBtn.style.pointerEvents = "auto";
    }

    // Escape key
    this.eventHandlers.escapeKey = (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.close();
      }
    };
    document.addEventListener("keydown", this.eventHandlers.escapeKey);

    console.log("✅ CheckoutModal events setup complete");
  }

  cleanupEvents() {
    // Remove all event listeners
    for (const [event, handler] of Object.entries(this.eventHandlers)) {
      if (event === "escapeKey") {
        document.removeEventListener("keydown", handler);
      } else {
        this.modal?.removeEventListener(event, handler);
        this.closeBtn?.removeEventListener("click", handler);
        this.okBtn?.removeEventListener("click", handler);
        this.termsBtn?.removeEventListener("click", handler);
      }
    }
    this.eventHandlers = {};
  }

  open(message = "Anda harus menyetujui Syarat & Ketentuan terlebih dahulu.") {
    if (!this.isInitialized) this.init();

    this.currentMessage = message;

    if (this.messageEl) {
      this.messageEl.textContent = message;
    }

    if (this.modal) {
      this.modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // DEBUG: Cek tombol
      console.log("🔍 Modal buttons check:");
      console.log("Close button:", this.closeBtn);
      console.log("OK button:", this.okBtn);
      console.log("Terms button:", this.termsBtn);

      // Force enable buttons
      setTimeout(() => {
        if (this.closeBtn) {
          this.closeBtn.style.cursor = "pointer";
          this.closeBtn.style.pointerEvents = "auto";
          this.closeBtn.disabled = false;
        }
        if (this.okBtn) {
          this.okBtn.style.cursor = "pointer";
          this.okBtn.style.pointerEvents = "auto";
          this.okBtn.disabled = false;
          this.okBtn.focus(); // Focus ke OK button
        }
        if (this.termsBtn) {
          this.termsBtn.style.cursor = "pointer";
          this.termsBtn.style.pointerEvents = "auto";
          this.termsBtn.disabled = false;
        }
      }, 50);
    }

    console.log("🟢 CheckoutModal opened:", message);
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  destroy() {
    this.cleanupEvents();
    this.modal?.remove();
    this.isInitialized = false;
    this.modal = null;
  }
}

// Export both modals
const checkoutModal = new CheckoutModal();

class TermsModal {
  constructor() {
    this.modalId = "termsModal";
    this.modalHTML = `
      <div class="modal-overlay" id="${this.modalId}">
        <div class="modal-container terms-modal">
          <button class="modal-close-btn" id="terms-modal-close-btn" aria-label="Tutup">
            &times;
          </button>
          
          <div class="modal-header">
            <div class="modal-icon terms-icon">
              <i class="fas fa-file-contract"></i>
            </div>
            <h3>Syarat & Ketentuan</h3>
          </div>
          
          <div class="modal-body">
            <div class="terms-content" id="terms-content">
              <h4>Syarat & Ketentuan Bakule Kembang:</h4>
              <ol>
                <li>Produk bunga akan dikirim sesuai ketersediaan stok</li>
                <li>Pengembalian hanya bisa dilakukan dalam 24 jam setelah penerimaan</li>
                <li>Warna bunga mungkin sedikit berbeda dari gambar karena pencahayaan</li>
                <li>Untuk pengiriman same-day, order harus dilakukan sebelum jam 14:00</li>
              </ol>
              <p class="terms-note">Dengan mencentang kotak ini, Anda menyetujui semua syarat di atas.</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="modal-btn primary" id="terms-modal-agree-btn">
              <i class="fas fa-check-circle"></i> Mengerti & Setuju
            </button>
          </div>
        </div>
      </div>
    `;

    this.isInitialized = false;
    this.modal = null;
    this.eventHandlers = {};
  }

  init() {
    if (this.isInitialized) {
      console.log("🔁 TermsModal already initialized");
      return;
    }

    console.log("🔧 TermsModal initializing...");

    // Clean up old modal
    const oldModal = document.getElementById(this.modalId);
    if (oldModal) oldModal.remove();

    // Inject to modal container
    let modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "modal-container";
      document.body.appendChild(modalContainer);
    }

    // Add modal HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = this.modalHTML;
    modalContainer.appendChild(tempDiv.firstElementChild);

    // Get elements
    this.modal = document.getElementById(this.modalId);
    this.closeBtn = document.getElementById("terms-modal-close-btn");
    this.agreeBtn = document.getElementById("terms-modal-agree-btn");
    this.contentEl = document.getElementById("terms-content");

    if (!this.modal) {
      console.error("❌ TermsModal elements not found!");
      return;
    }

    this.setupEvents();
    this.isInitialized = true;
    console.log("✅ TermsModal initialized");
  }

  setupEvents() {
    this.cleanupEvents();

    // Overlay click to close
    this.eventHandlers.overlayClick = (e) => {
      if (e.target === this.modal) this.close();
    };
    this.modal.addEventListener("click", this.eventHandlers.overlayClick);

    // Close button
    this.eventHandlers.closeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    };

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.eventHandlers.closeClick);
      this.closeBtn.style.cursor = "pointer";
      this.closeBtn.style.pointerEvents = "auto";
    }

    // Agree button - AUTO-CHECK CHECKBOX!
    this.eventHandlers.agreeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Auto-check the terms checkbox
      const termsCheckbox = document.getElementById("agree-terms");
      if (termsCheckbox) {
        termsCheckbox.checked = true;

        // Trigger change event if needed
        termsCheckbox.dispatchEvent(new Event("change"));

        // Highlight feedback
        const label = termsCheckbox.closest(".checkbox-label");
        if (label) {
          label.style.backgroundColor = "rgba(126, 96, 191, 0.2)";
          label.style.transition = "background-color 0.5s";
          setTimeout(() => {
            label.style.backgroundColor = "";
          }, 1500);
        }
      }

      this.close();
    };

    if (this.agreeBtn) {
      this.agreeBtn.addEventListener("click", this.eventHandlers.agreeClick);
      this.agreeBtn.style.cursor = "pointer";
      this.agreeBtn.style.pointerEvents = "auto";
    }

    // Escape key
    this.eventHandlers.escapeKey = (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.close();
      }
    };
    document.addEventListener("keydown", this.eventHandlers.escapeKey);

    console.log("✅ TermsModal events setup complete");
  }

  cleanupEvents() {
    for (const [event, handler] of Object.entries(this.eventHandlers)) {
      if (event === "escapeKey") {
        document.removeEventListener("keydown", handler);
      } else {
        this.modal?.removeEventListener(event, handler);
        this.closeBtn?.removeEventListener("click", handler);
        this.agreeBtn?.removeEventListener("click", handler);
      }
    }
    this.eventHandlers = {};
  }

  open() {
    if (!this.isInitialized) this.init();

    if (this.modal) {
      this.modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus on agree button
      setTimeout(() => {
        if (this.agreeBtn) {
          this.agreeBtn.focus();
          this.agreeBtn.style.cursor = "pointer";
          this.agreeBtn.style.pointerEvents = "auto";
        }
      }, 100);
    }

    console.log("🟢 TermsModal opened");
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  destroy() {
    this.cleanupEvents();
    this.modal?.remove();
    this.isInitialized = false;
    this.modal = null;
  }
}

// Create instance
const termsModal = new TermsModal();

class SuccessModal {
  constructor() {
    this.modalId = "successModal";
    this.modalHTML = `
            <div class="modal-overlay" id="${this.modalId}">
        <div class="modal-container success-modal">
          <button class="modal-close-btn" id="success-modal-close-btn" aria-label="Tutup">
            &times;
          </button>
          
          <div class="modal-content">
            <!-- ICON BESAR 
            <div class="success-icon-large">
              <i class="fas fa-check-circle"></i>
            </div> -->
            
            <!-- JUDUL -->
            <h2 class="success-title">🎉 Order Berhasil!</h2>
            
            <!-- PESAN -->
            <p class="success-message">
              Terima kasih telah berbelanja di Bakule Kembang!<br>
              Bunga indah Anda sedang dipersiapkan.
            </p>
            
            <!-- DETAIL ORDER -->
            <div class="order-details">
              <div class="detail-item">
                <i class="fas fa-receipt"></i>
                <div>
                  <span class="detail-label">No. Order:</span>
                  <span class="detail-value" id="success-order-id">ORD-1767856557315-245</span>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="fas fa-money-bill-wave"></i>
                <div>
                  <span class="detail-label">Total Pembayaran:</span>
                  <span class="detail-value" id="success-order-total">Rp 785.000</span>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="fas fa-shipping-fast"></i>
                <div>
                  <span class="detail-label">Estimasi Pengiriman:</span>
                  <span class="detail-value" id="success-shipping-estimate">3-5 hari kerja</span>
                </div>
              </div>
              
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <div>
                  <span class="detail-label">Konfirmasi:</span>
                  <span class="detail-value" id="success-email-notice">Telah dikirim ke email</span>
                </div>
              </div>
            </div>
            
            <!-- TOMBOL AKSI - UPDATE INI -->
            <div class="success-actions">
              <!-- TAMBAH TOMBOL BARU -->
              <button class="modal-btn outline" id="success-detail-btn">
                <i class="fas fa-file-alt"></i> Lihat Detail
              </button>
              <button class="modal-btn secondary" id="success-continue-btn">
                <i class="fas fa-shopping-cart"></i> Lanjut Belanja
              </button>
              <button class="modal-btn primary" id="success-home-btn">
                <i class="fas fa-home"></i> Kembali Ke Beranda
              </button>
            </div>
            
            <!-- FOOTNOTE -->
            <p class="success-footnote">
              <i class="fas fa-headset"></i> Butuh bantuan? 
              <a href="#contact" class="contact-link">Hubungi Customer Service</a>
            </p>
          </div>
        </div>
      </div>
    `;

    this.isInitialized = false;
    this.modal = null;
    this.eventHandlers = {};
    this.currentOrderData = null;
  }

  init() {
    if (this.isInitialized) {
      console.log("🔁 SuccessModal already initialized");
      return;
    }

    console.log("🔧 SuccessModal initializing...");

    // Clean up old modal
    const oldModal = document.getElementById(this.modalId);
    if (oldModal) oldModal.remove();

    // Inject to modal container
    let modalContainer = document.getElementById("modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "modal-container";
      document.body.appendChild(modalContainer);
    }

    // Add modal HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = this.modalHTML;
    modalContainer.appendChild(tempDiv.firstElementChild);

    // Get elements - TAMBAH INI
    this.modal = document.getElementById(this.modalId);
    this.closeBtn = document.getElementById("success-modal-close-btn");
    this.detailBtn = document.getElementById("success-detail-btn"); // NEW
    this.continueBtn = document.getElementById("success-continue-btn");
    this.homeBtn = document.getElementById("success-home-btn");
    this.orderIdEl = document.getElementById("success-order-id");
    this.orderTotalEl = document.getElementById("success-order-total");
    this.shippingEstimateEl = document.getElementById(
      "success-shipping-estimate"
    );
    this.emailNoticeEl = document.getElementById("success-email-notice");

    if (!this.modal) {
      console.error("❌ SuccessModal elements not found!");
      return;
    }

    this.setupEvents();
    this.isInitialized = true;
    console.log("✅ SuccessModal initialized");
  }

  setupEvents() {
    this.cleanupEvents();

    // Overlay click to close
    this.eventHandlers.overlayClick = (e) => {
      if (e.target === this.modal) this.close();
    };
    this.modal.addEventListener("click", this.eventHandlers.overlayClick);

    // Close button
    this.eventHandlers.closeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      this.navigateToHome();
    };

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.eventHandlers.closeClick);
      this.closeBtn.style.cursor = "pointer";
      this.closeBtn.style.pointerEvents = "auto";
    }

    // NEW: Detail button - Navigate to order detail
    this.eventHandlers.detailClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      this.navigateToOrderDetail();
    };

    if (this.detailBtn) {
      this.detailBtn.addEventListener("click", this.eventHandlers.detailClick);
      this.detailBtn.style.cursor = "pointer";
      this.detailBtn.style.pointerEvents = "auto";
    }

    // Continue shopping button
    this.eventHandlers.continueClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      this.navigateToProducts();
    };

    if (this.continueBtn) {
      this.continueBtn.addEventListener(
        "click",
        this.eventHandlers.continueClick
      );
      this.continueBtn.style.cursor = "pointer";
      this.continueBtn.style.pointerEvents = "auto";
    }

    // Home button
    this.eventHandlers.homeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
      this.navigateToHome();
    };

    if (this.homeBtn) {
      this.homeBtn.addEventListener("click", this.eventHandlers.homeClick);
      this.homeBtn.style.cursor = "pointer";
      this.homeBtn.style.pointerEvents = "auto";
    }

    // Escape key
    this.eventHandlers.escapeKey = (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.close();
        this.navigateToHome();
      }
    };
    document.addEventListener("keydown", this.eventHandlers.escapeKey);

    console.log("✅ SuccessModal events setup complete");
  }

  navigateToHome() {
    if (window.navigateTo) {
      window.navigateTo("#home");
    } else {
      window.location.hash = "#home";
    }
  }

  navigateToProducts() {
    if (window.navigateTo) {
      window.navigateTo("#products");
    } else {
      window.location.hash = "#products";
    }
  }

  navigateToOrderDetail() {
    if (this.currentOrderData?.orderId) {
      // Navigate to order detail page
      if (window.navigateTo) {
        window.navigateTo(`#order-detail/${this.currentOrderData.orderId}`);
      } else {
        window.location.hash = `#order-detail/${this.currentOrderData.orderId}`;
      }

      console.log(
        `📍 Navigating to order detail: ${this.currentOrderData.orderId}`
      );
    } else {
      console.error("❌ Cannot navigate: No order data available");
    }
  }

  cleanupEvents() {
    for (const [event, handler] of Object.entries(this.eventHandlers)) {
      if (event === "escapeKey") {
        document.removeEventListener("keydown", handler);
      } else {
        this.modal?.removeEventListener(event, handler);
        this.closeBtn?.removeEventListener("click", handler);
        this.detailBtn?.removeEventListener("click", handler); // NEW
        this.continueBtn?.removeEventListener("click", handler);
        this.homeBtn?.removeEventListener("click", handler);
      }
    }
    this.eventHandlers = {};
  }

  open(orderData) {
    if (!this.isInitialized) this.init();

    this.currentOrderData = orderData;

    // Update modal content dengan data order
    if (this.orderIdEl && orderData) {
      this.orderIdEl.textContent = orderData.orderId;
    }

    if (this.orderTotalEl && orderData) {
      // Gunakan formatPrice jika ada, atau format manual
      if (window.formatPrice) {
        this.orderTotalEl.textContent = window.formatPrice(orderData.total);
      } else {
        this.orderTotalEl.textContent = `Rp ${orderData.total.toLocaleString(
          "id-ID"
        )}`;
      }
    }

    if (this.shippingEstimateEl) {
      // Tentukan estimasi berdasarkan shipping method
      const shippingEstimate = this.getShippingEstimate(orderData?.shipping);
      this.shippingEstimateEl.textContent = shippingEstimate;
    }

    if (this.emailNoticeEl && orderData?.customer?.email) {
      this.emailNoticeEl.textContent = `Telah dikirim ke ${orderData.customer.email}`;
    }

    if (this.modal) {
      this.modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus on DETAIL button (bukan home button)
      setTimeout(() => {
        if (this.detailBtn) {
          this.detailBtn.focus();
          this.detailBtn.style.cursor = "pointer";
          this.detailBtn.style.pointerEvents = "auto";
        }
      }, 100);
    }

    console.log("🟢 SuccessModal opened for order:", orderData?.orderId);
  }

  getShippingEstimate(shippingMethod) {
    switch (shippingMethod) {
      case "express":
        return "1-2 hari kerja";
      case "same-day":
        return "Hari ini (jika order sebelum jam 14:00)";
      default:
        return "3-5 hari kerja";
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  destroy() {
    this.cleanupEvents();
    this.modal?.remove();
    this.isInitialized = false;
    this.modal = null;
    this.currentOrderData = null;
  }
}

// Create instance
const successModal = new SuccessModal();

export {
  deleteModal,
  checkoutModal,
  termsModal,
  successModal,
  Modal,
  CheckoutModal,
  TermsModal,
  SuccessModal,
};
