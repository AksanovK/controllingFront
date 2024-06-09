import React from 'react';

const ImageRow = ({ images, onImageClick }) => {
    return (
        <div className="image-row-container">
            {images.map((image, index) => (
                <div key={index} className="image-container">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="communication-image"
                        onClick={() => onImageClick(image.alt)}
                    />
                </div>
            ))}
        </div>
    );
}

export default ImageRow;
