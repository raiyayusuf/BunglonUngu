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

export { deleteModal, Modal };
