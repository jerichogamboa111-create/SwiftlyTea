import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  // Clears cart when user logs out or switches accounts
  useEffect(() => {
    setItems([]);
  }, [user?.id]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        { product_id: product.id, name: product.name, price: product.price, quantity },
      ];
    });
  };

  const removeItem = (product_id) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  };

  const updateQty = (product_id, quantity) => {
    if (quantity <= 0) return removeItem(product_id);
    setItems((prev) =>
      prev.map((i) => (i.product_id === product_id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);