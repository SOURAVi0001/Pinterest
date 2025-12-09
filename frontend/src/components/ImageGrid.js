import React from 'react';
import './ImageGrid.css';
import ImageCard from './ImageCard';

const ImageGrid = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {images.map((image) => (
          <ImageCard key={image._id || image.pinId} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
