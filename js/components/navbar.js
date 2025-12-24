export function renderNavbar() {
  const navbar = document.getElementById("navbar");

  navbar.innerHTML = /*html*/ `
    <div class="nav-container">
      <a href="#home" class="nav-logo">Bloom Florist</a>
      <ul class="nav-items">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#cart">Cart</a></li>
      </ul>
    </div>
  `;
}
