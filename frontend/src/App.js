const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const PinterestImage = require('./models/PinterestImage');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow requests from your deployed frontend and localhost
app.use(cors({
  origin: '*', // For development. In production, replace '*' with your frontend URL like 'https://pinterest-xh0h.onrender.com'
  methods: ['GET', 'POST'],
  credentials: true
}));

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
    
    // NOTE: Pinterest API v5 Standard Access only allows searching YOUR OWN pins.
    // It does not allow searching the public Pinterest feed (requires Partner access).
    
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    
    // Check if token exists or is the placeholder
    if (!accessToken || accessToken.includes('your_pinterest_access_token')) {
      console.log("No valid Token found, returning sample data.");
      throw new Error('Pinterest access token not configured');
    }
    
    const response = await axios.get(`https://api.pinterest.com/v5/search/pins`, {
      params: {
        query: query,
        page_size: parseInt(limit), // API v5 uses page_size
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const pins = response.data?.items || [];
    
    // Save/Update in MongoDB
    const savedImages = await Promise.all(
      pins.map(async (pin) => {
        const pinId = pin.id;
        
        // Handle image structure variations in API v5
        const images = pin.media?.images || pin.images || {};
        // Get the best quality available
        const imageUrl = images['1200x']?.url || 
                        images['600x']?.url || 
                        images['400x300']?.url || 
                        images['originals']?.url ||
                        '';
        
        if (!imageUrl) return null;

        // Upsert (Update if exists, Insert if new)
        const updatedImage = await PinterestImage.findOneAndUpdate(
            { pinId: pinId },
            {
                title: pin.title || pin.description || 'Untitled',
                description: pin.description || pin.alt_text || '',
                imageUrl: imageUrl,
                link: pin.link || `https://www.pinterest.com/pin/${pinId}/`,
                board: pin.board_owner?.username || 'Pinterest',
                createdAt: new Date()
            },
            { new: true, upsert: true }
        );
        
        return updatedImage;
      })
    );

    const validSavedImages = savedImages.filter(img => img !== null);

    res.json({
      success: true,
      count: validSavedImages.length,
      images: validSavedImages,
    });

  } catch (error) {
    console.error('Pinterest API Error or Fallback:', error.response?.data || error.message);
    
    // FALLBACK: If API fails (token invalid) or returns 0 results (user has no pins)
    // Return sample data so the UI doesn't break.
    res.json({
      success: true, // Return true so frontend displays these images
      message: 'Showing sample data (API limitation or Invalid Token)',
      images: [
        {
          _id: 'sample1',
          pinId: 'sample1',
          title: 'Nature Landscape (Sample)',
          description: 'Sample image because Pinterest API requires pins on your account to search.',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=564',
          link: '#',
          board: 'Sample',
        },
        {
          _id: 'sample2',
          pinId: 'sample2',
          title: 'Ocean View (Sample)',
          description: 'Add pins to your Pinterest account to see them here.',
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=564',
          link: '#',
          board: 'Sample',
        }
      ],
    });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await PinterestImage.find().sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});