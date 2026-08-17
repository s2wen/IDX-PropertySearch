import './PropertySort.css';

export default function PropertySort({ sortBy, sortOrder, onSortChange}){
    const sortOptions = [
        { value: 'price', label: 'Price' },
        { value: 'date', label: 'Date Listed' },
        { value: 'sqft', label: 'Square Footage' },
        { value: 'beds', label: 'Beds'}
    ]

    const handleSortByChange = (e) => {
        onSortChange(e.target.value, sortOrder);

    };

    const handleSortOrderChange = (e) => {
        onSortChange(sortBy, e.target.value);
    };

    const handleToggleOrder = (e) => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        onSortChange(sortBy, newOrder);
    }

    return(
        <div className="property-sort">
            <div className="sort-controls">
                <div className="sort-group">
                    <label htmlFor="sortBy" className="sort-label">Sort by:</label>
                    <select
                        id="sortBy"
                        className="sort-select"
                        value={sortBy || ''}
                        onChange={handleSortByChange}
                    >
                        <option value="">Default</option>
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {sortBy && (
                    <button
                        className="sort-order-button"
                        onClick={handleToggleOrder}
                        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                        title={`Click to sort ${sortOrder === 'asc' ? 'high-to-low' : 'low-to-high'}`}
                    >
                        <span className="sort-order-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                        <span className="sort-order-label">
                            {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}