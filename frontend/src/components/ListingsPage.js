import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import './ListingsPage.css';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import PropertySort from './PropertySort';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const [itemsPerPage] = useState(21);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          limit: 21,
          offset: (currentPage - 1) * itemsPerPage,
          ...filters
        };

        if (sortBy) {
          params.sortBy = sortBy;
          params.sortOrder = sortOrder;
        }

        const data = await fetchProperties(params);
        if (!cancelled) {
          setProperties(data.result);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [filters, currentPage, sortBy, sortOrder]);

  if (loading) return <p className="listings-status">Loading properties…</p>;
  if (error) return <p className="listings-status listings-status--error">{error}</p>;
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSortBy('');
    setSortOrder('asc');
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSortBy('');
    setSortOrder('asc');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scroll(0,0);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder || 'asc');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total/itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <PropertyFilters 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
      />
      <p className="listings-count">
        Showing {startIndex}-{endIndex} of {total} properties
      </p>

      <PropertySort 
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <div className="listings-grid">
        {properties.map((p) => (
          <PropertyCard key={p.L_ListingID || p.id} property={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}