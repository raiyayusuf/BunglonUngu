// products
import { flowerProducts, getImagePath } from "./imageMapping.js";

// proses product buat add semua image path
export const products = flowerProducts.map((product) => ({
  ...product,
  image: getImagePath(product),
  imagePath: getImagePath(product),
}));

// helper function
export function getProductsByCategory(categoryId) {
  return products.filter((product) => products.category === categoryId);
}

export function getProductsByPackaging(packagingType) {
  return products.filter((product) => products.packaging === packagingType);
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

// unique packaging types
export const packagingTypes = [
  {
    id: "bouquet",
    name: "Buket",
    description: "Dengan wrapping kertas eksklusif",
  },
  { id: "bunch", name: "Bunch", description: "Sederhana tanpa wrapping" },
  {
    id: "bag",
    name: "Tas Transparan",
    description: "Dalam tas transparan praktis",
  },
];

// price range
export const priceRanges = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
  average: Math.round(
    products.reduce((sum, p) => sum + p.price, 0) / products.length
  ),
};
