import { useState } from 'react';
import './PropertyFilters.css';

export default function PropertyFilters({onFilterChange, onClearFilters, initialFilters={}}){
    const [filters, setFilters] = useState({
        city: initialFilters.city || '',
        zipcode: initialFilters.zipcode || '',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        beds: initialFilters.beds || '',
        baths: initialFilters.baths || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
        );
        onFilterChange(activeFilters);
    };

    const handleClear = () => {
        const emptyFilters = {
        city: '',
        zipcode: '',
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: ''
        };
        setFilters(emptyFilters);
        onClearFilters();
    };

    return (
        <form className="property-filters" onSubmit={handleSubmit}>
        <div className="filters-row">
            <div className="filter-group">
            <label htmlFor="city">City</label>
            <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="Enter city"
            />
            </div>

            <div className="filter-group">
            <label htmlFor="zipcode">ZIP Code</label>
            <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={filters.zipcode}
                onChange={handleChange}
                placeholder="Enter ZIP code"
            />
            </div>

            <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="$0"
                min="0"
            />
            </div>

            <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="$1,000,000"
                min="0"
            />
            </div>
        </div>

        <div className="filters-row">
            <div className="filter-group">
            <label htmlFor="beds">Beds</label>
            <select
                id="beds"
                name="beds"
                value={filters.beds}
                onChange={handleChange}
            >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            </div>

            <div className="filter-group">
            <label htmlFor="baths">Baths</label>
            <select
                id="baths"
                name="baths"
                value={filters.baths}
                onChange={handleChange}
            >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
                <option value="3">3</option>
                <option value="3.5">3.5</option>
                <option value="4">4</option>
            </select>
            </div>

            <div className="filter-actions">
            <button type="submit" className="btn btn-primary">
                Apply Filters
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Clear Filters
            </button>
            </div>
        </div>
        </form>
    );
}