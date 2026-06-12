export interface Product {
  id: string;
  name: string;
  category: 'freshwater' | 'saltwater' | 'gemstone' | 'crafting';
  price: number;
  image: string;
  description: string;
  features: string[];
  materials: string[];
  stockStatus: 'piece_unique' | 'edition_limitee' | 'disponible';
  stockCount?: number;
  timeToCreate: string;
  artisan: string;
  rating?: number;
  isFeatured?: boolean;
}

export interface BeadOption {
  id: string;
  name: string;
  color: string; // Tailwind hex or class color
  type: string;
  pricePerBead: number;
  description: string;
}

export interface CharmOption {
  id: string;
  name: string;
  icon: string; // Lucide icon or emoji
  price: number;
}

export interface CustomDesign {
  baseType: 'bracelet' | 'collier';
  threadType: 'gold' | 'silk' | 'macrame' | 'leather';
  beads: { beadId: string; count: number }[];
  charmId: string | null;
  totalLength: number; // in cm
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'general' | 'custom_diy' | 'product_reservation' | 'workshop_booking';
  productId?: string;
  customDesignDetails?: string;
  message: string;
  date: string;
  status: 'pending' | 'responded';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  id: string;
  date: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  paymentDetails: string;
  status: 'pending' | 'paid' | 'delivered';
  customerName: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  aiSuggested?: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
  artisanReply?: {
    author: string;
    comment: string;
    date: string;
  };
}

