export const testimonials = [
  {
    id: 1,
    name: "Jarjit Singh",
    role: "Mahasiswa",
    comment:
      "Saya beli Buket untuk teman yang wisuda, asli cakep banget, dia suka dan next bakal order lagi disini",
    rating: 5,
    date: "2025-07-01",
    productId: 10,
  },

  {
    id: 2,
    name: "Budi Santoso",
    role: "Suami",
    comment:
      "Pesan buket anniversary untuk istri, dia seneng banget! Pengiriman tepat waktu dan packing aman",
    rating: 5,
    date: "2025-05-23",
    productId: 4,
  },

  {
    id: 3,
    name: "Sari Wulandari",
    role: "Karyawan",
    comment:
      "Order rutin untuk dekorasi kantor. Pelayanan ramah dan bunga selalu fresh. Recommended",
    rating: 4,
    date: "2025-04-15",
    productId: 14,
  },

  {
    id: 4,
    name: "Yusuf Priatmojo",
    role: "Mahasiwa",
    comment:
      "Belinya yang tas transparan, praktis buat hadiah gebetan. Murah tapi kualitas sabilahh",
    rating: 5,
    date: "2025-12-10",
    productId: 18,
  },

  {
    id: 5,
    name: "Indah Putri",
    role: "Event Planner",
    comment:
      "Kerjasama untuk event perusahaan. Bunga segar, sesuai request, dan harga competitive.",
    rating: 4,
    date: "2025-09-05",
    productId: 7,
  },

  {
    id: 6,
    name: "Andi Saputra",
    role: "Pegawai Swasta",
    comment:
      "Koleksi bunga lengkap, packaging unik-unik. Suka sama yang pakai wrapping koran, artistic poll",
    rating: 5,
    date: "2025-06-30",
    productId: 13,
  },
];

// helper function
export function getTestimonialsByProductId(productId) {
  return testimonials.filter((t) => t.productId === productId);
}

export function getRecentTestimonials(limit = 3) {
  return [...testimonials]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}
