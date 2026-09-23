import { useEffect, useState, useCallback } from "react";
import './PropertyImageGallery.css';

export default function PropertyImageGallery({photos, propertyId}){
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);


    const imageUrls = parsePhotos(photos);
    const hasImage = imageUrls && imageUrls.length!==0;

    const goToPrevious = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    }, [imageUrls.length]);

    const goToNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    }, [imageUrls.length]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isLightboxOpen) return;
            switch (event.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    goToPrevious(event);
                    break;
                case 'ArrowRight':
                    goToNext(event);
                    break;
                default:
                    break;
            }
        }

        if (isLightboxOpen){
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };


    }, [isLightboxOpen, selectedIndex, imageUrls.length, goToNext, goToPrevious]);

    

    const openLightbox = (index) => {
        setSelectedIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    

    if(!hasImage){
        return (
            <div className="gallery-placeholder">
                <p>No photos available for this property</p>
            </div>
        );
    }

    return(
        <>
            <div className="gallery">
                <div className="gallery-main" onClick={() => openLightbox(selectedIndex)}>
                    <img 
                        src={imageUrls[selectedIndex]} 
                        className="gallery-main-image"
                        alt="Property Gallery"
                    />
                    <div className="gallery-click-hint">Click to enlarge</div>
                </div>
                <div className="gallery-thumbnails">
                    {imageUrls.map((url, index) => (
                        <div
                            key={index}
                            className={`gallery-thumbnail ${index === selectedIndex ? 'gallery-thumbnail--active' : ''}`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img src={url} alt={`Thumbnail ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {isLightboxOpen && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button 
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        x
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={imageUrls[selectedIndex]} 
                            className="lightbox-image"
                            alt="Lightbox"
                        />

                        {imageUrls.length > 1 && (
                            <>
                                <button 
                                    className="lightbox-button lightbox-button--prev"
                                    onClick={goToPrevious}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>

                                <button 
                                    className="lightbox-button lightbox-button--next"
                                    onClick={goToNext}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                                <div className="lightbox-counter">
                                    {selectedIndex + 1} / {imageUrls.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function parsePhotos(photos){
    if(!photos) return[];
    // parse L_Photos JSON string
    try {
        if (photos) {
            const photosParsed = JSON.parse(photos);
            return photosParsed;
        }
    } catch (e) {
        return e;
    }

}