export function loadProductsPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-container">
      <h1>🌷 Semua Produk</h1>
      <p>Halaman produk sedang dalam pengembangan...</p>
      <p>Menampilkan semua produk bunga dengan filter dan pencarian.</p>
      <a href="#home" class="btn btn-primary">Kembali ke Beranda</a>
    </div>
  `;
}
