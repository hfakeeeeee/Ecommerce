import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { ChatProvider } from './context/ChatContext';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Toast from './components/Toast';
import ChatWidget from './components/ChatWidget';
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <FavouritesProvider>
              <ChatProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <Footer />
                  <ScrollToTop />
                  <BackToTop />
                  <Toast />
                  <ChatWidget />
                </div>
              </ChatProvider>
            </FavouritesProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;