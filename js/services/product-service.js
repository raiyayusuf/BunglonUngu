// js/services/product-service.js - FIXED
import { products } from "../data/products.js";

export function filterProducts(filters = {}) {
  let filtered = [...products];

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((product) =>
      filters.category.includes(product.category)
    );
  }

  if (filters.flowerType && filters.flowerType.length > 0) {
    filtered = filtered.filter((product) =>
      filters.flowerType.includes(product.flowerType)
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((product) =>
      product.color.some((color) => filters.colors.includes(color))
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((product) =>
      product.tags.some((tag) => filters.tags.includes(tag))
    );
  }

  if (filters.featuredOnly) {
    filtered = filtered.filter((product) => product.featured);
  }

  if (filters.searchKeyword && filters.searchKeyword.trim() !== "") {
    const keyword = filters.searchKeyword.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
        product.color.some((color) => color.toLowerCase().includes(keyword))
    );
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter((product) => product.inStock);
  }

  return filtered;
}

export function sortProducts(productsArray, sortBy = "featured") {
  const sorted = [...productsArray];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);

    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);

    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case "featured":
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });

    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.id - b.id;
      });
  }
}

export function getProductsByCategory(categoryId) {
  return products.filter((product) => product.category === categoryId);
}

export function getProductsByFlowerType(flowerType) {
  return products.filter((product) => product.flowerType === flowerType);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

export function getProductsInPriceRange(min, max) {
  return products.filter(
    (product) => product.price >= min && product.price <= max
  );
}

export function getRandomProducts(count = 4) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRelatedProducts(productId, limit = 4) {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];

  const related = products.filter(
    (p) =>
      p.id !== productId &&
      (p.category === currentProduct.category ||
        p.flowerType === currentProduct.flowerType ||
        p.tags.some((tag) => currentProduct.tags.includes(tag)) ||
        p.color.some((color) => currentProduct.color.includes(color)))
  );

  return related.sort(() => 0.5 - Math.random()).slice(0, limit);
}

export function getProductStats() {
  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.featured).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const averagePrice = Math.round(totalValue / totalProducts);
  const averageRating =
    products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;

  return {
    totalProducts,
    featuredCount,
    averagePrice,
    averageRating: parseFloat(averageRating.toFixed(1)),
    minPrice: Math.min(...products.map((p) => p.price)),
    maxPrice: Math.max(...products.map((p) => p.price)),
  };
}

export function getFilteredAndSortedProducts(
  filters = {},
  sortBy = "featured"
) {
  const filtered = filterProducts(filters);
  return sortProducts(filtered, sortBy);
}
