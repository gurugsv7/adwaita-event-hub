import merchTshirt from "@/assets/merch-tshirt-1.jpg";
import merchHoodie from "@/assets/merch-hoodie.jpg";
import merchPolo from "@/assets/merch-polo.jpg";
import merchJacket from "@/assets/merch-jacket.jpg";
import merchCap from "@/assets/merch-cap.jpg";
import merchJoggers from "@/assets/merch-joggers.jpg";

export interface MerchItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  description: string;
  features: string[];
  category: string;
  badge?: string;
  accentColor: string;
}

export const merchItems: MerchItem[] = [
  {
    id: "neon-oversized-tee",
    name: "Neon Oversized Tee",
    tagline: "Glow Different",
    price: 599,
    originalPrice: 799,
    image: merchTshirt,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Oversized drop-shoulder tee with UV-reactive neon geometric print. The official ADWAITA 2026 signature piece.",
    features: ["UV-reactive print", "240 GSM cotton", "Drop shoulder fit", "Unisex"],
    category: "Topwear",
    badge: "BESTSELLER",
    accentColor: "#FF1B9F",
  },
  {
    id: "cyber-hoodie",
    name: "Cyber Hoodie",
    tagline: "Fade Into The Future",
    price: 1299,
    originalPrice: 1599,
    image: merchHoodie,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium heavyweight hoodie with holographic gradient print. Kangaroo pocket, ribbed cuffs. Built for the night.",
    features: ["Holographic print", "350 GSM fleece", "Kangaroo pocket", "Drawstring hood"],
    category: "Topwear",
    badge: "LIMITED",
    accentColor: "#00FFD9",
  },
  {
    id: "royal-polo",
    name: "Royal Polo",
    tagline: "Elegance Meets Edge",
    price: 799,
    image: merchPolo,
    sizes: ["S", "M", "L", "XL"],
    description: "Deep purple polo with gold embroidered ADWAITA crest. Premium piqué cotton for a refined festival look.",
    features: ["Gold embroidery", "Piqué cotton", "Classic fit", "Contrast collar trim"],
    category: "Topwear",
    accentColor: "#FFD700",
  },
  {
    id: "bomber-jacket",
    name: "Neon Bomber",
    tagline: "Own The Night",
    price: 1899,
    originalPrice: 2299,
    image: merchJacket,
    sizes: ["S", "M", "L", "XL"],
    description: "Black bomber jacket with neon embroidery patches. Ribbed collar and cuffs. The ultimate festival outerwear.",
    features: ["Neon embroidery", "Satin lining", "Ribbed trims", "Zip front"],
    category: "Outerwear",
    badge: "PREMIUM",
    accentColor: "#FF1B9F",
  },
  {
    id: "adwaita-snapback",
    name: "ADWAITA Snapback",
    tagline: "Cap The Vibe",
    price: 449,
    image: merchCap,
    sizes: ["Free Size"],
    description: "Structured snapback with reflective ADWAITA logo. Adjustable strap, curved brim. Glows under UV light.",
    features: ["Reflective logo", "Adjustable snap", "Curved brim", "UV-reactive"],
    category: "Accessories",
    accentColor: "#B44FFF",
  },
  {
    id: "neon-joggers",
    name: "Neon Stripe Joggers",
    tagline: "Move In Light",
    price: 999,
    originalPrice: 1199,
    image: merchJoggers,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Black joggers with neon side stripes that glow under UV. Elastic waistband, tapered fit, zip pockets.",
    features: ["UV-reactive stripes", "Zip pockets", "Tapered fit", "Elastic waistband"],
    category: "Bottomwear",
    accentColor: "#00FFD9",
  },
];
