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
app.use(cors());
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
    
    const response = await axios.get(`https://api.pinterest.com/v5/search/pins`, {
      params: {
        query: query,
        limit: parseInt(limit),
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Pinterest API v5 returns data in items array
    const pins = response.data?.items || response.data?.data || [];
    
    // Save to MongoDB
    const savedImages = await Promise.all(
      pins.map(async (pin) => {
        const pinId = pin.id || pin.pin_id || `pin_${Date.now()}_${Math.random()}`;
        const existingImage = await PinterestImage.findOne({ pinId });
        if (existingImage) {
          return existingImage;
        }
        
        // Handle different Pinterest API response formats
        const imageUrl = pin.media?.images?.['564x']?.url || 
                        pin.media?.images?.['origin']?.url || 
                        pin.image_url || 
                        pin.media?.images?.['474x']?.url || '';
        
        const image = new PinterestImage({
          pinId: pinId,
          title: pin.title || pin.description || pin.alt_text || 'Untitled',
          description: pin.description || pin.note || '',
          imageUrl: imageUrl,
          link: pin.link || pin.url || pin.board_url || '',
          board: pin.board?.name || pin.board_name || '',
          createdAt: pin.created_at ? new Date(pin.created_at) : new Date(),
        });
        
        return await image.save();
      })
    );

    res.json({
      success: true,
      count: savedImages.length,
      images: savedImages,
    });
  } catch (error) {
    console.error('Pinterest API Error:', error.response?.data || error.message);
    
    // Fallback: Return sample data if API fails
    res.json({
      success: false,
      message: 'Using sample data. Please configure Pinterest API token.',
      images: [
        {
          pinId: 'sample1',
          title: 'Sample Image 1',
          description: 'Sample description',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=564',
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
