import React from 'react';
import './PropertyCard.css';
import { Navigate, useNavigate } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';

function PropertyCard({ property }) {
  const navigate = useNavigate();
  
  console.log('Property card rendering with ID:', property.L_ListingID || property.id);

  const handleClick = () => {
    navigate(`/property/${property.L_ListingID}`);
  }

  // parse L_Photos JSON string
  // let photoUrl = null;
  // try {
  //   if (property.L_Photos) {
  //     const photos = JSON.parse(property.L_Photos);
  //     if (Array.isArray(photos) && photos.length > 0) {
  //       photoUrl = photos[0];
  //     }
  //   }
  // } catch (e) {
  //   photoUrl = null;
  // }

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return `$${Number(price).toLocaleString()}`;
  };

  return (
    <article className="property-card" onClick={handleClick}>
      <PropertyImageCarousel 
        photos={property.L_Photos} 
        listingId={property.L_ListingID || property.id}
      />
      {/* <div className="property-card__image">
        {photoUrl ? (
          <img src={photoUrl} alt={property.L_Address || 'Property'} loading="lazy" />
        ) : (
          <div className="property-card__placeholder">No photo</div>
        )}
      </div> */}
      <div className="property-card__body">
        <p className="property-card__price">{formatPrice(property.L_SystemPrice)}</p>
        <p className="property-card__address">{property.L_Address}</p>
        <p className="property-card__location">
          {property.L_City}, {property.L_State}
        </p>
        <p className="property-card__details">
          {property.L_Keyword2 ?? '—'} bd · {property.LM_Dec_3 ?? '—'} ba ·{' '}
          {property.LM_Int2_3 ? `${property.LM_Int2_3.toLocaleString()} sqft` : '— sqft'}
        </p>
      </div>
    </article>
  );
}

export default PropertyCard;