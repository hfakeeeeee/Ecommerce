import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ProductContext = createContext();

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 12
  });

  const fetchProducts = useCallback(async (page = 0, size = 12, minPrice = null, maxPrice = null, query = null, sortBy = 'name', sortOrder = 'asc') => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (minPrice !== null && maxPrice !== null) {
        url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.content || data);
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        size: data.size || 12
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category, page = 0, size = 12, minPrice = null, maxPrice = null, query = null, sortBy = 'name', sortOrder = 'asc') => {
    try {
      setLoading(true);
      let url = category ? `${API_BASE_URL}/api/products/category/${category}?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}` : `${API_BASE_URL}/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (minPrice !== null && maxPrice !== null) {
        url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.content || data);
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        size: data.size || 12
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products by category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []); // Only run once on mount

  const value = {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductsByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 