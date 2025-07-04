import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App