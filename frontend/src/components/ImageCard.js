import React, { useState } from 'react';
import './ImageCard.css';

const ImageCard = ({ image }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = 'https://via.placeholder.com/600x800/f0f0f0/999999?text=Unavailable';

  return (
    <div className="image-card">
      <div className="image-card-wrapper">
        <img
          src={!imageError ? (image.imageUrl || fallbackImage) : fallbackImage}
          alt={image.title || 'Visual Content'}
          className="image-card-img"
          onError={handleImageError}
          loading="lazy"
        />
        
        <a 
          href={image.link && image.link !== '#' ? image.link : undefined}
          target="_blank" 
          rel="noopener noreferrer"
          className="image-overlay-link"
        >
          <div className="image-card-overlay">
            <div className="image-card-info">
              <span className="image-category">{image.board || 'General'}</span>
              <h3 className="image-card-title">{image.title || 'Untitled'}</h3>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ImageCard;