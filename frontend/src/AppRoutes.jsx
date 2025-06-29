import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuth } from './context/AuthContext'
import UserProfilePage from './pages/UserProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ShippingPage from './pages/ShippingPage'
import WarrantyPage from './pages/WarrantyPage'
import SetupGuidesPage from './pages/SetupGuidesPage'
import FAQPage from './pages/FAQPage'

export default function AppRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // If still loading auth state, show nothing
  if (loading) {
    return null
  }

  // If logged in and trying to access auth routes, redirect to home
  if (user && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/" replace />
  }

  // Function to check if the current route requires authentication
  const requiresAuth = (pathname) => {
    return ['/profile', '/cart'].includes(pathname)
  }

  // If trying to access protected routes without being logged in
  if (!user && requiresAuth(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected Routes - Only accessible when logged in */}
      <Route path="/profile" element={<UserProfilePage />} />

      {/* New customer service pages */}
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/warranty" element={<WarrantyPage />} />
      <Route path="/setup-guides" element={<SetupGuidesPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
