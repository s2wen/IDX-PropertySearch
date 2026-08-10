import './PropertyMap.css';

export default function PropertyMap({ latitude , longitude }){
    const validCoords = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);

    if(!validCoords){
        return(
            <div className="map-container">
                <div className="map-unavailable">
                    <p>Map location not available for this property</p>
                </div>
            </div>
        );
    }

    const lat = parseFloat(latitude).toFixed(6);
    const long = parseFloat(longitude).toFixed(6);

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${lat},${long}&zoom=15`;

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;

    return(
        <div className="map-container">
            <div className="map-wrapper">
                <iframe
                    className="map-iframe"
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map for Current Property"
                />
            </div>

            <div className="map-actions">
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-button map-button--directions"
                >Get Directions
                </a>
            </div>
        </div>
    );

}