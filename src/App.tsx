import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppFloat from './components/layout/WhatsAppFloat';
import CartDrawer from './components/layout/CartDrawer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminSetup = lazy(() => import('./pages/admin/AdminSetup'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminInstagram = lazy(() => import('./pages/admin/AdminInstagram'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider>
            <CartProvider>
              <WishlistProvider>
                <AdminProvider>
                  <ErrorBoundary>
                    <div className="min-h-screen bg-theme-bg text-cream">
                      <Navbar />
                      <CartDrawer />
                      <main>
                        <Suspense fallback={<LoadingSpinner />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/product/:slug" element={<ProductPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/setup" element={<AdminSetup onComplete={() => window.location.href = '/admin/login'} />} />
                            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                              <Route path="products" element={<AdminProducts />} />
                              <Route path="orders" element={<AdminOrders />} />
                              <Route path="instagram" element={<AdminInstagram />} />
                              <Route path="settings" element={<AdminSettings />} />
                            </Route>
                          </Routes>
                        </Suspense>
                      </main>
                      <Footer />
                      <WhatsAppFloat />
                    </div>
                  </ErrorBoundary>
                </AdminProvider>
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
