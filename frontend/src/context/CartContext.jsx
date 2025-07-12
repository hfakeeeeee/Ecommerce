import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Toast from '../components/Toast'

const CartContext = createContext();

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: '', visible: false });
  const { user, token } = useAuth();

  // Fetch cart from backend when authenticated
  useEffect(() => {
    console.log('CartContext: Auth state changed', { hasUser: !!user, hasToken: !!token });
    if (token && user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [token, user]);

  const fetchCart = async () => {
    if (!token) {
      console.log('CartContext: No token available, clearing cart');
      setItems([]);
      return;
    }

    try {
      console.log('CartContext: Fetching cart with token:', token.substring(0, 20) + '...');
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('CartContext: Cart response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const contentType = response.headers.get("content-type");
      console.log('CartContext: Response content type:', contentType);
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('CartContext: Cart data received:', data);
        setItems(data.items || []);
      } else {
        console.log('CartContext: No JSON content received');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    }
  };

  const showNotification = (message) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: '', visible: false });
    }, 3000);
  };

  const addToCart = async (product, quantity = 1) => {
    if (!token || !user) {
      showNotification('Please log in to add items to cart');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          quantity
        })
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setItems(updatedCart.items);
        showNotification('Item added to cart');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding item to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setItems(updatedCart.items);
        showNotification('Item removed from cart');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showNotification('Error removing item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/update-quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setItems(updatedCart.items);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('Error updating quantity');
    }
  };

  const clearCart = async () => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setItems([]);
        showNotification('Cart cleared');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('Error clearing cart');
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        notification
      }}
    >
      {children}
      <Toast
        message={notification.message}
        type="cart"
        isVisible={notification.visible}
        onClose={() => setNotification({ message: '', visible: false })}
        action="cart"
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 