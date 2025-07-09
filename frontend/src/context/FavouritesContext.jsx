import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
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
      const response = await fetch('/api/favorites', {
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

  const addToFavourites = async (product) => {
    if (!token || !user) {
      console.log('User must be logged in to add favorites');
      return;
    }

    try {
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (response.ok) {
        await fetchFavourites(); // Refresh the favorites list
      } else {
        console.error('Failed to add favourite:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  const removeFromFavourites = async (productId) => {
    if (!token || !user) return;

    try {
      const response = await fetch(`/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchFavourites(); // Refresh the favorites list
      } else {
        console.error('Failed to remove favourite:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  const toggleFavourite = async (product) => {
    if (!token || !user) {
      console.log('User must be logged in to manage favorites');
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
      const response = await fetch(`/api/favorites/check/${productId}`, {
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
      isFavourited
    }}>
      {children}
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