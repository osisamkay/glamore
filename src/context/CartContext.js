"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const items = await response.json();
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: item.id || item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity || 1
        }),
      });

      if (response.ok) {
        // Refresh cart items after adding
        await fetchCartItems();
        return true;
      } else {
        console.error('Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCartItems();
        return true;
      } else {
        console.error('Failed to remove item from cart');
        return false;
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  };

  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        await fetchCartItems();
        return true;
      } else {
        console.error('Failed to update cart item quantity');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    loading,
    refreshCart: fetchCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
