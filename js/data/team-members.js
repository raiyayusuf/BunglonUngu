export const teamMembers = [
  {
    id: 1,
    name: "Raiya Yusuf Priatmojo",
    role: "Founder & Head Florist",
    image: "assets/images/team/florist-1.jpg",
    description:
      "Berkecimpung di dunia floristry sejak 2018. Spesialis dalam rangkaian bunga tradisional-modern.",
    expertise: ["Buket Tradisional", "Rangkaian Modern", "Bunga Pernikahan"],
    social: { instagram: "@sakura_flowers", email: "sakura@bakulekembang.com" },
  },
  {
    id: 2,
    name: "Rafa Naufal Yusuf Priatmojo",
    role: "Operations Manager",
    image: "assets/images/team/ops-1.jpg",
    description:
      "Memastikan setiap pesanan sampai tepat waktu dengan kondisi prima.",
    expertise: ["Logistik", "Customer Service", "Quality Control"],
    social: { email: "bima@bakulekembang.com" },
  },
  {
    id: 3,
    name: "Sinchan",
    role: "Creative Designer",
    image: "assets/images/team/designer-1.jpg",
    description:
      "Ahli dalam menciptakan konsep rangkaian yang unik dan personal.",
    expertise: ["Konsep Visual", "Kustomisasi", "Trend Forecasting"],
    social: { instagram: "@dewi_creatives", email: "dewi@bakulekembang.com" },
  },
  {
    id: 4,
    name: "Guteng",
    role: "Delivery Specialist",
    image: "assets/images/team/delivery-1.jpg",
    description:
      "Tangan pertama yang menyerahkan kebahagiaan kepada pelanggan kami.",
    expertise: ["Penanganan Bunga", "Navigasi", "Customer Relations"],
    social: { email: "arjuna@bakulekembang.com" },
  },
];

// Fallback images jika foto belum ada
export function getTeamImage(member) {
  const fallbackImages = {
    1: "assets/image/flowers/bouquet/mix-bouquet-cream.jpg",
    2: "assets/image/flowers/bunch/rose-pink-bunch-pink.jpg",
    3: "assets/image/flowers/bag/rose-pink-bag.jpg",
    4: "assets/image/backgrounds/floral-bg.jpg",
  };

  return (
    member.image || fallbackImages[member.id] || "assets/image/placeholder.jpg"
  );
}
