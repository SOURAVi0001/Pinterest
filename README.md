# PrintPress - Pinterest Image Gallery

A modern single-page application built with the MERN stack that integrates with Pinterest API to fetch and display beautiful images.

## Features

- 🔍 Search Pinterest images by keywords
- 📱 Responsive design for all devices
- 🎨 Beautiful, modern UI with gradient backgrounds
- 💾 MongoDB integration to store fetched images
- ⚡ Fast and efficient image loading
- 🔄 Real-time image fetching from Pinterest API

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose
- **API**: Pinterest API v5

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Pinterest Developer Account & Access Token

## Setup Instructions

### 1. Clone the repository

```bash
cd Printpress
```

### 2. Install Dependencies

**Option A: Install all at once (recommended)**
```bash
npm run install-all
```

**Option B: Install separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Backend Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/printpress
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here
```

**Getting Pinterest Access Token:**
1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Sign in with your Pinterest account
3. Create a new app at https://developers.pinterest.com/apps/
4. After creating the app, go to the app settings
5. Generate an access token with the following scopes:
   - `pins:read` (to read pins)
   - `boards:read` (to read board information)
6. Copy the access token and add it to your `.env` file

**Note:** If you don't have a Pinterest access token yet, the app will show sample images. You can still test the application functionality.

### 4. Frontend Configuration (Optional)

Create a `.env` file in the `frontend` directory if you need to change the API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas (Cloud):**
- Use your MongoDB Atlas connection string in the `.env` file:
  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/printpress
  ```

### 6. Run the Application

**Option A: Run both servers together (recommended)**
```bash
# From the root directory
npm run dev
```

**Option B: Run separately**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/pinterest/search?query=nature&limit=20` - Search Pinterest images
- `GET /api/images` - Get all saved images
- `GET /api/images/:id` - Get a specific image
- `GET /api/health` - Health check endpoint

## Project Structure

```
Printpress/
├── backend/
│   ├── models/
│   │   └── PinterestImage.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.js
│   │   │   ├── ImageGrid.js
│   │   │   ├── ImageCard.js
│   │   │   └── LoadingSpinner.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Usage

1. Open the application in your browser
2. Enter a search query (e.g., "nature", "travel", "food")
3. Click "Search" to fetch images from Pinterest
4. Hover over images to see details
5. Click on images to view them on Pinterest

## Notes

- The app includes fallback sample images if the Pinterest API is not configured
- Images are automatically saved to MongoDB for future reference
- The application uses a responsive grid layout for optimal viewing on all devices

## Troubleshooting

1. **MongoDB Connection Error**: 
   - Ensure MongoDB is running: `mongosh` or `mongo` should connect
   - Check your connection string in `.env`
   - For MongoDB Atlas, ensure your IP is whitelisted

2. **Pinterest API Error**: 
   - Verify your access token is valid and has proper scopes
   - Check token expiration
   - The app will show sample images if API is not configured

3. **CORS Issues**: 
   - The backend includes CORS middleware
   - Ensure backend is running on port 5000
   - Check that frontend proxy is configured correctly

4. **Port Already in Use**:
   - Backend: Change `PORT` in `backend/.env`
   - Frontend: Change port with `PORT=3001 npm start`

5. **Module Not Found Errors**:
   - Run `npm install` in both `backend` and `frontend` directories
   - Delete `node_modules` and `package-lock.json`, then reinstall

## License

ISC

## Author

Created with ❤️ using MERN Stack
