import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favourites');
    if (stored) setFavourites(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (product) => {
    setFavourites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavourites = (productId) => {
    setFavourites((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleFavourite = (product) => {
    if (favourites.find((p) => p.id === product.id)) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product);
    }
  };

  const isFavourited = (productId) => {
    return favourites.some((p) => p.id === productId);
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addToFavourites, removeFromFavourites, toggleFavourite, isFavourited }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
} 