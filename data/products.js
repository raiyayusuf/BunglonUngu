// data/products.js - FINAL FIXED
import { flowerProducts, getImagePath } from "./imageMapping.js";

export const products = flowerProducts.map((product) => ({
  ...product,
  image: getImagePath(product),
  imagePath: getImagePath(product),
}));

// Helper functions - FIXED VERSION
export function getProductsByCategory(categoryId) {
  return products.filter((product) => product.category === categoryId);
}

export function getProductsByPackaging(packagingType) {
  return products.filter((product) => product.packaging === packagingType);
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

export const packagingTypes = [
  {
    id: "bouquet",
    name: "Buket",
    description: "Dengan wrapping kertas eksklusif",
  },
  { id: "bunch", name: "Iketan", description: "Sederhana tanpa wrapping" },
  { id: "bag", name: "Tas", description: "Dalam tas transparan praktis" },
];

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
  average: Math.round(
    products.reduce((sum, p) => sum + p.price, 0) / products.length
  ),
};
