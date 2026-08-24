import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from '../PropertyImageCarousel';
import './PropertyCard.css';

/**
 * PropertyCard component
 * @param {Object} property - Property data object
 * @param {string} property.L_ListingID - Listing ID
 * @param {number} property.L_SystemPrice - Property price
 * @param {string} property.L_Address - Street
 * @param {string} property.L_City - City
 * @param {string} property.L_State - State
 * @param {string} property.L_Zip - ZIP code
 * @param {string} property.L_Keyword2 - Number of bedrooms
 * @param {string} property.LM_Dec_3 - Number of bathrooms
 * @param {number} property.L_SqFtTotal - Total square footage
 * @param {number} property.L_YearBuilt - Year built
 * @param {Array|string} property.L_Photos - Property photos
 */
export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  
  const propertyId = property.L_ListingID || property.id;

  const handleClick = () => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  // Format price with commas
  const formattedPrice = property.L_SystemPrice 
    ? `$${property.L_SystemPrice.toLocaleString()}`
    : 'Price not available';

  // Format address
  const address = [
    property.L_Address,
    property.L_City,
    property.L_State,
    property.L_Zip
  ].filter(Boolean).join(', ') || 'Address not available';

  return (
    <div className="property-card" onClick={handleClick} role="button" tabIndex={0}>
      <PropertyImageCarousel 
        photos={property.L_Photos} 
        listingId={propertyId}
      />
      <div className="property-card-content">
        <h3 className="property-price">{formattedPrice}</h3>
        <p className="property-address">{address}</p>
        <div className="property-stats">
          <span>{property.L_Keyword2 || '—'} beds</span>
          <span>{property.LM_Dec_3 || '—'} baths</span>
          <span>{property.L_SqFtTotal?.toLocaleString() || '—'} sqft</span>
          <span>Built {property.L_YearBuilt || '—'}</span>
        </div>
      </div>
    </div>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.string,
    id: PropTypes.string,
    L_SystemPrice: PropTypes.number,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_Zip: PropTypes.string,
    L_Keyword2: PropTypes.string,
    LM_Dec_3: PropTypes.string,
    L_SqFtTotal: PropTypes.number,
    L_YearBuilt: PropTypes.number,
    L_Photos: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ])
  }).isRequired
};