// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const PinterestImage = require('./models/PinterestImage');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS Configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/printpress', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Pinterest API Routes
app.get('/api/pinterest/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

    if (!accessToken || accessToken === 'your_pinterest_access_token_here') {
      throw new Error('Pinterest access token not configured');
    }

    // NOTE: The /v5/search/pins endpoint searches the AUTHENTICATED USER'S pins.
    // Standard API v5 access does not allow searching the public Pinterest feed.
    const response = await axios.get(`https://api.pinterest.com/v5/search/pins`, {
      params: {
        query: query,
        page_size: parseInt(limit), // Corrected: v5 uses 'page_size', not 'limit'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Pinterest API v5 returns data in 'items' array
    const pins = response.data?.items || [];

    // Save to MongoDB
    const savedImages = await Promise.all(
      pins.map(async (pin) => {
        const pinId = pin.id; // v5 uses 'id'
        const existingImage = await PinterestImage.findOne({ pinId });
        if (existingImage) {
          return existingImage;
        }

        // Corrected: v5 Standard Image Keys (1200x, 600x, 400x300)
        // Note: media.images might differ for video pins, checking defensively
        const images = pin.media?.images || pin.images || {}; // defensive check
        const imageUrl = images['1200x']?.url ||
          images['600x']?.url ||
          images['400x300']?.url ||
          '';
        // 
        if (!imageUrl) return null; // Skip if no valid image found

        const image = new PinterestImage({
          pinId: pinId,
          title: pin.title || pin.description || 'Untitled',
          description: pin.description || pin.alt_text || '',
          imageUrl: imageUrl,
          link: pin.link || `https://www.pinterest.com/pin/${pinId}/`,
          board: pin.board_owner?.username || '', // v5 structure differs for board info
          createdAt: pin.created_at ? new Date(pin.created_at) : new Date(),
        });

        return await image.save();
      })
    );

    // Filter out nulls (failed saves)
    const validSavedImages = savedImages.filter(img => img !== null);

    // If API returns success but 0 items (common for user search), return valid empty set
    // The frontend will display "No images found"
    res.json({
      success: true,
      count: validSavedImages.length,
      images: validSavedImages,
    });

  } catch (error) {
    // Log detailed API error
    console.error('Pinterest API Error:', error.response?.data || error.message);

    // Fallback: Return sample data if API fails or Token is invalid
    // This ensures the UI still looks good for testing
    res.json({
      success: false,
      message: 'Using sample data. API Limit reached or Token invalid.',
      images: [
        {
          pinId: 'sample1',
          title: 'Sample: Mountain View',
          description: 'This is a sample image because the Pinterest API returned no results or failed.',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=564',
          link: '#',
          board: 'Sample Board',
        },
        {
          pinId: 'sample2',
          title: 'Sample: Forest Path',
          description: 'Please add pins to your Pinterest account to see them appear in search.',
          imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=564',
          link: '#',
          board: 'Sample Board',
        }
      ],
    });
  }
});

// Get all saved images
app.get('/api/images', async (req, res) => {
  try {
    const images = await PinterestImage.find().sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get image by ID
app.get('/api/images/:id', async (req, res) => {
  
  try {
    const image = await PinterestImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
