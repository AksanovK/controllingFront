import React, { useState } from 'react';

const ImageRowCascadeComponent = ({ images, onImageClick }) => {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageClick = (imageAlt) => {
        const isSelected = selectedImages.includes(imageAlt);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((alt) => alt !== imageAlt));
        } else {
            setSelectedImages([...selectedImages, imageAlt]);
        }
    };

    return (<div>
            <div className="image-row-container">
                {images.map((image, index) => {
                    const isSelected = selectedImages.includes(image.alt);
                    const shadowColor = isSelected ? `hsl(${index * 30}, 70%, 50%)` : 'transparent';
                    return (
                        <div key={index} className="image-container">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className={`communication-image-cascade${isSelected ? ' selected' : ''}`}
                                onClick={() => handleImageClick(image.alt)}
                                style={{ boxShadow: `0 0 10px ${shadowColor}` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="text-xl mt-4 text-white inter-font cursor-pointer justify-center text-center" onClick={() => onImageClick(selectedImages)}>
                <p className="max-w-20 mx-auto justify-center hover:scale-125">Далее</p>
            </div>
    </div>

    );
};

export default ImageRowCascadeComponent;
