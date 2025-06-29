import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Header />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App