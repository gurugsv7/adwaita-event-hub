import merchHoodie from "@/assets/merch-hoodie-new.png";
import merchSweatshirt from "@/assets/merch-sweatshirt.png";
import merchOversizedTee from "@/assets/merch-oversized-tee.png";
import merchRegularTee from "@/assets/merch-regularfit-tee.png";
import merchCroptop from "@/assets/merch-croptop.png";

export interface MerchItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
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
    id: "hoodie-unisex",
    name: "Hoodie",
    tagline: "Unisex · Premium Fleece",
    price: 750,
    image: merchHoodie,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    description: "Official ADWAITA'26 unisex hoodie with premium fleece, kangaroo pocket, and drawstring hood. Built for comfort and style.",
    features: ["Premium fleece", "Kangaroo pocket", "Drawstring hood", "Unisex fit"],
    category: "Topwear",
    badge: "POPULAR",
    accentColor: "#00FFD9",
  },
  {
    id: "sweatshirt-unisex",
    name: "Sweatshirt",
    tagline: "Unisex · Cozy Fleece",
    price: 700,
    image: merchSweatshirt,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    description: "Official ADWAITA'26 unisex sweatshirt with soft fleece lining, ribbed cuffs, and a clean crew-neck fit.",
    features: ["Fleece lining", "Ribbed cuffs", "Crew neck", "Unisex fit"],
    category: "Topwear",
    accentColor: "#B44FFF",
  },
  {
    id: "crop-top",
    name: "Crop Top",
    tagline: "Bold & Trendy",
    price: 450,
    image: merchCroptop,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "Official ADWAITA'26 crop top with a stylish cut, perfect for making a statement at the fest.",
    features: ["Trendy crop cut", "Comfortable fit", "Soft fabric", "Statement piece"],
    category: "Topwear",
    accentColor: "#FF1B9F",
  },
  {
    id: "regularfit-tshirt",
    name: "Regular Fit T-Shirt",
    tagline: "Classic Comfort",
    price: 450,
    image: merchRegularTee,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official ADWAITA'26 regular fit tee — clean, classic, and comfortable for everyday wear.",
    features: ["Classic fit", "Soft cotton", "Lightweight", "Everyday wear"],
    category: "Topwear",
    accentColor: "#FFD700",
  },
  {
    id: "oversized-tshirt",
    name: "Oversized T-Shirt",
    tagline: "Unisex · Drop Shoulder",
    price: 550,
    image: merchOversizedTee,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official ADWAITA'26 unisex oversized tee with drop-shoulder fit and premium cotton fabric.",
    features: ["Drop shoulder", "Premium cotton", "Relaxed fit", "Unisex"],
    category: "Topwear",
    badge: "BESTSELLER",
    accentColor: "#FF1B9F",
  },
];
