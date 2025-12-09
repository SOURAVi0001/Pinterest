import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import LoadingSpinner from './components/LoadingSpinner';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Ensure this points to your deployed backend URL + /api
// Example for Render: https://printpress-backend.onrender.com/api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('nature');

  // Load initial images on start
  useEffect(() => {
    fetchImages('nature');
  }, []);

  const fetchImages = async (query, limit = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      // Connects to: GET /api/pinterest/search
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
      setError('Failed to fetch images. Backend might be sleeping or down.');
      
      // Fallback: Show sample images if backend fails so the UI doesn't look broken
      setImages([
        {
          _id: 'sample1',
          pinId: 'sample1',
          title: 'Connection Error (Sample)',
          description: 'Could not connect to backend. This is a sample image.',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=564',
          link: '#',
          board: 'Sample',
        },
        {
          _id: 'sample2',
          pinId: 'sample2',
          title: 'Try Refreshing',
          description: 'Please check your internet or try again later.',
          imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=564',
          link: '#',
          board: 'Sample',
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
        <div className="container">
          <h1 className="app-title">📌 PrintPress</h1>
          <p className="app-subtitle">Discover beautiful images from Pinterest</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <ImageGrid images={images} />
          )}

          {!loading && images.length === 0 && (
            <div className="no-results">
              <p>No images found. Try a different search term.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 PrintPress - Powered by Pinterest API</p>
            <div className="footer-links">
              <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
            </div>
          </div>
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