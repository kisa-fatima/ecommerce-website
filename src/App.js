import './App.css';
import AboveHeader from './components/AboveHeader';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import AllProducts from './pages/AllProducts';
import Footer from './components/Footer';
import Login from './pages/Login';

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && <AboveHeader />}
      {location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {location.pathname !== '/login' && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
