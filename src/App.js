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
import Casual from './pages/Casual'
import Formal from './pages/Formal';
import Party from './pages/Party';
import Gym from './pages/Gym';
import Loader from './components/Loader';
import React from 'react';
import AdminPanel from './pages/AdminPanel';
import ProductPage from './pages/ProductPage';
import { updateAllProductsCategoryNames } from './services/databaseFunctions';
import ProtectedRoute from './components/ProtectedRoute';

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
        <Route
          path="/admin-dashboard/*"
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
      <AppContent />
    </Router>
  );
}

export default App;
