import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AssetDetailPage from './pages/AssetDetailPage';
import LoginPage from './pages/LoginPage';
import GetSellerIdPage from './pages/GetSellerIdPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SellPage from './pages/SellPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 100px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assets/:id" element={<AssetDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/seller-id" element={<GetSellerIdPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/sell" element={<SellPage />} />
          </Routes>
        </main>

        <footer style={{ padding: '80px 0 40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <div className="container">
            <p>© 2026 Puppet Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  );
};

export default App;
