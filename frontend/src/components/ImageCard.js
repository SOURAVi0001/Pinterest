import React, { useState } from 'react';
import './ImageCard.css';

const ImageCard = ({ image }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = 'https://via.placeholder.com/564x564/667eea/ffffff?text=Image+Not+Available';

  return (
    <div className="image-card">
      <div className="image-card-wrapper">
        {!imageError ? (
          <img
            src={image.imageUrl || fallbackImage}
            alt={image.title || 'Pinterest Image'}
            className="image-card-img"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="image-error-placeholder">
            <span>Image unavailable</span>
          </div>
        )}
        
        <div className="image-card-overlay">
          <div className="image-card-info">
            <h3 className="image-card-title">{image.title || 'Untitled'}</h3>
            {image.description && (
              <p className="image-card-description">{image.description}</p>
            )}
            {image.board && (
              <span className="image-card-board">📌 {image.board}</span>
            )}
          </div>
        </div>
      </div>
      
      {image.link && image.link !== '#' && (
        <a
          href={image.link}
          target="_blank"
          rel="noopener noreferrer"
          className="image-card-link"
        >
          View on Pinterest →
        </a>
      )}
    </div>
  );
};

export default ImageCard;
