import { createContext, useContext, useState, ReactNode } from "react";
import { merchItems, MerchItem } from "@/data/merch";

export interface CartItem {
  itemId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface MerchCartContextType {
  cartItems: CartItem[];
  addItem: (itemId: string, size: string, quantity: number) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const MerchCartContext = createContext<MerchCartContextType | undefined>(undefined);

export const MerchCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = (itemId: string, size: string, quantity: number) => {
    const item = merchItems.find((m) => m.id === itemId);
    if (!item) return;

    // Check if same item + size exists
    const existingIndex = cartItems.findIndex(
      (ci) => ci.itemId === itemId && ci.size === size
    );

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity = Math.min(updated[existingIndex].quantity + quantity, 5);
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        { itemId, name: item.name, size, quantity, price: item.price, image: item.image },
      ]);
    }
  };

  const removeItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return removeItem(index);
    const updated = [...cartItems];
    updated[index].quantity = Math.min(quantity, 5);
    setCartItems(updated);
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <MerchCartContext.Provider
      value={{ cartItems, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </MerchCartContext.Provider>
  );
};

export const useMerchCart = () => {
  const context = useContext(MerchCartContext);
  if (!context) throw new Error("useMerchCart must be used within MerchCartProvider");
  return context;
};
