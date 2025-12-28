export function loadProductDetailPage(productId) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-container">
      <h1>🔍 Detail Produk #${productId}</h1>
      <p>Halaman detail produk sedang dalam pengembangan...</p>
      <a href="#products" class="btn btn-primary">Kembali ke Produk</a>
    </div>
  `;
}
