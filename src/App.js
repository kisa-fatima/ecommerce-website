import React from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import AboveHeader from './components/AboveHeader';
import Header from './components/Header';
import ScrollToTop from './ScrollToTop';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import AllProducts from './pages/AllProducts';
import Footer from './components/Footer';
import Login from './pages/Login';
import Casual from './pages/Casual';
import Formal from './pages/Formal';
import Party from './pages/Party';
import Gym from './pages/Gym';
import Loader from './components/Loader';
import AdminPanel from './pages/AdminPanel';
import ProductPage from './pages/ProductPage';
import { updateAllProductsCategoryNames } from './services/databaseFunctions';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';
import CheckoutPage from './pages/CheckoutPage';
import PanelHeader from './components/PanelHeader';
import MyAccount from './pages/MyAccount';
const ADMIN_EMAIL = 'admin123@gmail.com';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && location.pathname !== '/login' && <AboveHeader />}
      {!isAdmin && location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/casual" element={<Casual />} />
        <Route path="/formal" element={<Formal />} />
        <Route path="/party" element={<Party />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:slug" element={<ProductPage />} />
      </Routes>
      {!isAdmin && location.pathname !== '/login' && <Footer />}
    </>
  );
}

function App() {
  const [loading, setLoading] = React.useState(true);
  const user = useSelector(state => state.auth.user);
  const isAdmin = user && user.email === ADMIN_EMAIL;

  React.useEffect(() => {
    // Removed temporary updateAllProductsCategoryNames useEffect
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <ScrollToTop />
      {isAdmin && <PanelHeader />}
      <AppContent />
    </Router>
  );
}

export default App;
