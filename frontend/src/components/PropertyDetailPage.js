import {useEffect, useState}  from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPropertyDetail, fetchPropertyOpenHouses } from '../api/client';
import PropertyImageGallery from './PropertyImageGallery';
import './PropertyDetailPage.css';
import PropertyMap from './PropertyMap';

export default function PropertyDetailPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('Property ID from URL:', id);
    console.log('Type of ID:', typeof id);
    console.log('Length of ID:', id?.length);

    useEffect(() => {
        let cancelled = false;
        
        async function load() {
            setLoading(true);
            setError(null);
            try {
                //property data
                const propertyData = await fetchPropertyDetail(id);
                if (!cancelled) {
                    setProperty(propertyData);
                }

                try{
                    //openhouses
                    const openhouseData = await fetchPropertyOpenHouses(id);
                    console.log('Property data received:', propertyData);
                    if(!cancelled){
                        setOpenHouses(openhouseData || []);
                    }
                }catch(error){
                    console.warn('Could not fetch open houses:', error);
                    if (!cancelled) {
                        setOpenHouses([]);
                    }
                }
                


            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
    
        load();
        return () => { cancelled = true; };
    }, [id]);

    const getOpenHouseRemarks = (openHouse) => {
        if (!openHouse.all_data) return null;
        try{
            const allData = typeof openHouse.all_data === 'string' ? JSON.parse(openHouse.all_data) : openHouse.all_data;
            return allData?.OpenHouseRemarks || null;
        }catch(e){
            return null;
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading){
        return(
            <div className="detail-loading">
                <p>Loading Property Details...</p>
            </div>
        );
    }

    if(error){
        return (
            <div className="detail-error">
                <h2>Error Loading Property</h2>
                <p>{error}</p>
                <button onClick={handleBack} className="btn btn-secondary">
                    Go back
                </button>
            </div>
        );
    }

    if (!property){
        return(
            <div className="detail-error">
                <h2>Property Not Found</h2>
                <p>The property you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">
                    Return to Listings
                </Link>
            </div>
        );
    }

    const formatPrice = (price) => {
        if (!price) return 'Price not available';
        return `$${Number(price).toLocaleString()}`;
    };

    const latitude = property.LMD_MP_Latitude;
    const longitude = property.LMD_MP_Longitude;


    return(
        <div className="detail-page">
            <button onClick={handleBack} className="detail-back-button">
                Back to Listings
            </button>
            <h1 className="detail-title">{formatPrice(property.L_SystemPrice)}</h1>

            <p className="detail-address">{[property.L_Address, property.L_City, property.L_State, property.L_Zip].filter(Boolean).join(', ')}</p>

            <PropertyImageGallery 
                photos={property.L_Photos} 
                propertyId={property.L_ListingID || property.id}
            />

            <div className="detail-stats">
                <div className="detail-stat">
                    <span className="detail-stat-label">Beds</span>
                    <span className="detail-stat-value">{property.L_Keyword2 || '—'}</span>
                </div>
                <div className="detail-stat">
                    <span className="detail-stat-label">Baths</span>
                    <span className="detail-stat-value">{property.LM_Dec_3 || '—'}</span>
                </div>
                <div className="detail-stat">
                    <span className="detail-stat-label">Square Feet</span>
                    <span className="detail-stat-value">{property.LM_Int2_3 || '—'}</span>
                </div>
                <div className="detail-stat">
                    <span className="detail-stat-label">Year Built</span>
                    <span className="detail-stat-value">{property.YearBuilt || '—'}</span>
                </div>
            </div>

            {property.L_Remarks && (
                <div className="detail-section">
                    <h2 className="detail-section-title">Description</h2>
                    <p className="detail-description">{property.L_Remarks}</p>
                </div>
            )}

            {openHouses.length == 0 && (
                <div className="detail-section">
                    <h2 className="detail-section-title">Open Houses</h2>
                    <p className="detail-description">No open houses scheduled</p>
                </div>
            )}
            {openHouses.length > 0 && (
                <div className="detail-section">
                <h2 className="detail-section-title">Open Houses</h2>
                <div className="open-houses-list">
                    {openHouses.map((oh, index) => {
                        const remarks = getOpenHouseRemarks(oh);
                        return(
                            <div key={index} className="open-house-item">
                                <div className='open-house-header'>
                                    <div className="open-house-date">
                                    {formatDate(oh.OH_StartDate)}
                                    </div>
                                    <div className="open-house-time">
                                    {oh.OH_StartTime} - {oh.OH_EndTime}
                                    </div>
                                </div>
                                
                                {remarks && (
                                    <div className="open-house-remarks">
                                        {remarks}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                </div>
            )}

            <div className="detail-section">
                <h2 className="detail-section-title">Location</h2>
                <PropertyMap 
                    latitude={latitude}
                    longitude={longitude}
                />
            </div>
        </div>
    );
}

function formatDate(dateString) {
    if (!dateString) return 'Date not available';
    try{
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }catch(e){
        return dateString;
    }
}