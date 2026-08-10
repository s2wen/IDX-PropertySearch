import { useState } from "react";
//TODO: import css
import './PropertyImageCarousel.css';

function parsePhotos(photos){
    if(!photos) return[];
    // parse L_Photos JSON string
    if (typeof photos === 'string') {
        try {
        const parsed = JSON.parse(photos);
        if (Array.isArray(parsed)) {
            return parsed.filter(url => url && url.trim() !== '');
        }
        } catch (e) {
        // Not valid JSON, treat as single URL
        return photos.trim() ? [photos] : [];
        }
    }
  
    return [];

}
export default function PropertyImageCarousel({photos, listingId}){
    const [currentIndex, setCurrentIndex] = useState(0);

    const imageUrls = parsePhotos(photos);
    const hasImage = imageUrls && imageUrls.length!=0;

    const goToPrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    const goToNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

    if(!hasImage){
        return(
            <div className="carousel-placeholder">
                <span>No Photos Available</span>
            </div>
        );
    }

    return(
        <div className="carousel">
            <div className="carousel-image-container">
                <img
                    src={imageUrls[currentIndex]}
                    className="carousel-image"
                />
                {imageUrls.length>1&&(
                    <>
                        <button
                            className="carousel-button carousel-button--prev"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                        <button
                            className="carousel-button carousel-button--next"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                        <div className="carousel-counter">
                            {currentIndex + 1} / {imageUrls.length}
                        </div>
                    </>
                )};
            </div>
        </div>
    );

}