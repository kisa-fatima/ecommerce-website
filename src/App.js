import './App.css';
import AboveHeader from './components/AboveHeader';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';

function App() {
  return (
    <Router>
      <AboveHeader />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/kids" element={<Kids />} />
      </Routes>
    </Router>
  );
}

export default App;
