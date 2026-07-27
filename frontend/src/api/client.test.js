import { fetchProperties, fetchPropertyDetail, fetchPropertyOpenHouses } from './client';

// Mock fetch
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch properties with default parameters', async () => {
    const mockData = {
      total: 100,
      limit: 20,
      offset: 0,
      result: [
        { id: 1, L_ListingID: '1234567890', L_City: 'New York' }
      ]
    };
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    );

    const result = await fetchProperties({ limit: 20, offset: 0 });

    expect(fetch).toHaveBeenCalledWith(
      '/api/properties?limit=20&offset=0',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' }
      })
    );
    expect(result).toEqual(mockData);
  });

  test('should handle filter parameters correctly', async () => {
    const mockData = {
      total: 5,
      limit: 20,
      offset: 0,
      result: []
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    );

    const filters = {
      city: 'New York',
      zipcode: '10001',
      minPrice: '500000',
      maxPrice: '1000000',
      beds: '3',
      baths: '2.5'
    };

    await fetchProperties(filters);

    // Check that all filter parameters are included
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('city=New');
    expect(url).toContain('zipcode=10001');
    expect(url).toContain('minPrice=500000');
    expect(url).toContain('maxPrice=1000000');
    expect(url).toContain('beds=3');
    expect(url).toContain('baths=2.5');
  });

  test('should fetch property details with valid ID', async () => {
    const mockProperty = {
      L_ListingID: '1234567890',
      L_City: 'New York',
      L_SystemPrice: 750000
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProperty)
      })
    );

    const result = await fetchPropertyDetail('1234567890');

    expect(fetch).toHaveBeenCalledWith(
      '/api/properties/1234567890',
      expect.any(Object)
    );
    expect(result).toEqual(mockProperty);
  });
});