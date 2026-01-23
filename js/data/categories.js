// js\data\categories.js:
import { products } from "./products.js";

console.log("📊 Loading categories.js, products count:", products.length);

export const categories = [
  {
    id: "bouquet",
    name: "Buket Esklusif",
    icon: "💐",
    count: products.filter((p) => p.category === "bouquet").length,
    description: "Dengan wrapping kertas eksklusif",
  },
  {
    id: "bunch",
    name: "Bunch",
    icon: "🌿",
    count: products.filter((p) => p.category === "bunch").length,
    description: "Sederhana tanpa wrapping",
  },
  {
    id: "bag",
    name: "Tas Transparan",
    icon: "🧺",
    count: products.filter((p) => p.category === "bag").length,
    description: "Dalam tas transparan praktis",
  },
];

export const flowerTypes = [
  {
    id: "rose",
    name: "Mawar",
    icon: "🌹",
    count: products.filter((p) => p.flowerType === "rose").length,
  },
  {
    id: "tulip",
    name: "Tulip",
    icon: "🌷",
    count: products.filter((p) => p.flowerType === "tulip").length,
  },
  {
    id: "gerbera",
    name: "Gerbera",
    icon: "🌼",
    count: products.filter((p) => p.flowerType === "gerbera").length,
  },
  {
    id: "hydrangea",
    name: "Hydrangea",
    icon: "💮",
    count: products.filter((p) => p.flowerType === "hydrangea").length,
  },
  {
    id: "mixed",
    name: "Campuran",
    icon: "🪷",
    count: products.filter((p) => p.flowerType === "mixed").length,
  },
];

export const priceRanges = [
  {
    id: "under-100",
    name: "Dibawah Rp 100.000",
    min: 0,
    max: 99999,
    count: products.filter((p) => p.price < 100000).length,
  },
  {
    id: "100-150",
    name: "Rp 100.000 - Rp 150.000",
    min: 100000,
    max: 150000,
    count: products.filter((p) => p.price >= 100000 && p.price <= 150000)
      .length,
  },
  {
    id: "150-200",
    name: "Rp 150.000 - Rp 200.000",
    min: 150000,
    max: 200000,
    count: products.filter((p) => p.price >= 150000 && p.price <= 200000)
      .length,
  },
  {
    id: "above-200",
    name: "Diatas Rp 200.000",
    min: 200000,
    max: Infinity,
    count: products.filter((p) => p.price > 200000).length,
  },
];

export const colors = (() => {
  const allColors = products.flatMap((p) => p.color);
  const uniqueColors = [...new Set(allColors)];

  return uniqueColors.map((color) => ({
    id: color.toLowerCase().replace(/\s+/g, "-"),
    name: color,
    count: products.filter((p) => p.color.includes(color)).length,
  }));
})();

export const tags = (() => {
  const allTags = products.flatMap((p) => p.tags);
  const uniqueTags = [...new Set(allTags)];

  return uniqueTags.map((tag) => ({
    id: tag.toLowerCase().replace(/\s+/g, "-"),
    name: tag,
    count: products.filter((p) => p.tags.includes(tag)).length,
  }));
})();

export const featuredFilter = {
  id: "featured",
  name: "Produk Unggulan",
  icon: "🌟",
  count: products.filter((p) => p.featured).length,
};

export const sortOptions = [
  { id: "price-asc", name: "Harga Terendah", icon: "⬆️" },
  { id: "price-desc", name: "Harga Tertinggi", icon: "⬇️" },
  { id: "rating-desc", name: "Rating Tertinggi", icon: "⬇️" },
  { id: "name-asc", name: "Nama A-Z", icon: "🔤" },
  { id: "name-desc", name: "Nama Z-A", icon: "🔤" },
  { id: "featured", name: "Unggulan", icon: "🌟" },
];

export const priceStats = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
  average: Math.round(
    products.reduce((sum, p) => sum + p.price, 0) / products.length,
  ),
};

export function getAllFilterValues() {
  return {
    categories,
    flowerTypes,
    priceRanges,
    colors,
    tags,
    featuredFilter,
    sortOptions,
    priceStats,
  };
}
