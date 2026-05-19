import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    if (!user) { setCart([]); setCartCount(0); return; }
    try {
      const res = await api.get('/cart');
      setCart(res.data);
      setCartCount(res.data.reduce((s, i) => s + i.quantity, 0));
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (product_id, quantity = 1) => {
    await api.post('/cart', { product_id, quantity });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart([]); setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
