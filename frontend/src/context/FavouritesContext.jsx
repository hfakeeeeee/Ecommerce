import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Toast from '../components/Toast';

const FavouritesContext = createContext();

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [notification, setNotification] = useState({ message: '', visible: false });
  const auth = useAuth();
  const token = auth?.token;
  const user = auth?.user;

  // Fetch favorites from backend when authenticated
  useEffect(() => {
    if (token && user) {
      fetchFavourites();
    } else {
      setFavourites([]);
    }
  }, [token, user]);

  const fetchFavourites = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavourites(data);
      } else {
        console.error('Failed to fetch favourites:', response.status);
      }
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const showNotification = (message) => {
    setNotification({ message, visible: true });
    setTimeout(() => {
      setNotification({ message: '', visible: false });
    }, 3000);
  };

  const addToFavourites = async (product) => {
    if (!token || !user) {
      showNotification('Please log in to add items to favourites');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (response.ok) {
        await fetchFavourites(); // Refresh the favorites list
        showNotification('Added to favourites');
      } else {
        console.error('Failed to add favourite:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        showNotification('Error adding to favourites');
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  const removeFromFavourites = async (productId) => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchFavourites(); // Refresh the favorites list
        showNotification('Removed from favourites');
      } else {
        console.error('Failed to remove favourite:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        showNotification('Error removing from favourites');
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  const toggleFavourite = async (product) => {
    if (!token || !user) {
      showNotification('Please log in to manage favourites');
      return;
    }

    try {
      const isFavourited = await checkFavourite(product.id);
      if (isFavourited) {
        await removeFromFavourites(product.id);
      } else {
        await addToFavourites(product);
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const checkFavourite = async (productId) => {
    if (!token || !user) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      console.error('Failed to check favourite status:', response.status);
      return false;
    } catch (error) {
      console.error('Error checking favourite status:', error);
      return false;
    }
  };

  const isFavourited = (productId) => {
    return favourites.some(fav => fav.product.id === productId);
  };

  return (
    <FavouritesContext.Provider value={{
      favourites,
      addToFavourites,
      removeFromFavourites,
      toggleFavourite,
      isFavourited,
      notification
    }}>
      {children}
      <Toast
        message={notification.message}
        type="success"
        isVisible={notification.visible}
        onClose={() => setNotification({ message: '', visible: false })}
      />
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
} 