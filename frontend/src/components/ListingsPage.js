import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import './ListingsPage.css';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProperties({ limit: 20, offset: 0 });
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
  }, []);

  if (loading) return <p className="listings-status">Loading properties…</p>;
  if (error) return <p className="listings-status listings-status--error">{error}</p>;

  return (
    <div className="listings-page">
      <h1>Property Listings</h1>
      <p className="listings-count">
        Showing {properties.length} of {total} properties
      </p>
      <div className="listings-grid">
        {properties.map((p) => (
          <PropertyCard key={p.L_ListingID || p.id} property={p} />
        ))}
      </div>
    </div>
  );
}