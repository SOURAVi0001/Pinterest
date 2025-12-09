import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import LoadingSpinner from './components/LoadingSpinner';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Fix: Ensure API_URL ends with /api to match backend routes
let API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = `${API_URL}/api`;
}

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('nature');

  useEffect(() => {
    fetchImages('nature');
  }, []);

  const fetchImages = async (query, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/pinterest/search`, {
        params: { query, limit },
      });
      if (response.data.success) {
        setImages(response.data.images);
      } else {
        setImages(response.data.images || []);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Unable to retrieve content. Please try again.');
      // Fallback
      setImages([
        {
          _id: 'sample1',
          pinId: 'sample1',
          title: 'Connection Error',
          description: 'Could not connect to backend.',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=564',
          link: '#',
          board: 'System',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchImages(query);
  };

  const HomePage = () => (
    <div className="App">
      <header className="app-header">
        <div className="container header-content">
          <h1 className="app-title">PrintPress</h1>
          <p className="app-subtitle">Curated visual inspiration.</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          
          {error && <div className="error-message">{error}</div>}

          {loading ? <LoadingSpinner /> : <ImageGrid images={images} />}

          {!loading && images.length === 0 && (
            <div className="no-results">
              <p>No results found.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 PrintPress</p>
          <a href="/privacy-policy" className="footer-link">Privacy</a>
        </div>
      </footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;