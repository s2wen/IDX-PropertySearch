

import { jest } from '@jest/globals';
const mockQuery = jest.fn();

jest.unstable_mockModule('../db.js', () => ({
  default: {
    query: mockQuery
  }
}));

const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: propertyRoutes } = await import('./properties.js');
const { default: db } = await import('../db.js');

console.log('db.query is:', typeof db.query);

// Create test app
const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/properties', () => {
    test('should return properties with default pagination', async () => {
      const mockRows = [
        { L_ListingID: '1234567890', L_City: 'New York', L_SystemPrice: 750000 },
        { L_ListingID: '0987654321', L_City: 'Boston', L_SystemPrice: 550000 }
      ];

      mockQuery
        .mockResolvedValueOnce([[{ total: 2 }]]) // Count query
        .mockResolvedValueOnce([mockRows]); // Data query

      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body).toEqual({
        total: 2,
        limit: 20,
        offset: 0,
        sortBy: 'default',
        sortOrder: 'asc',
        result: mockRows
      });

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    test('should handle pagination parameters', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?limit=10&offset=20')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[0][0]).toContain('SELECT COUNT(*)');
      expect(calls[1][0]).toContain('LIMIT ? OFFSET ?');
      expect(calls[1][1]).toEqual(expect.arrayContaining([10, 20]));
    });

    test('should filter by city', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?city=Irvine')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[0][0]).toContain('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
      expect(calls[0][1]).toContain('Irvine');
    });

    test('should filter by ZIP code', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?zipcode=10001')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[0][0]).toContain('L_Zip = ?');
      expect(calls[0][1]).toContain('10001');
    });

    test('should filter by price range', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?minPrice=500000&maxPrice=1000000')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[0][0]).toContain('L_SystemPrice >= ?');
      expect(calls[0][0]).toContain('L_SystemPrice <= ?');
      expect(calls[0][1]).toContain(500000);
      expect(calls[0][1]).toContain(1000000);
    });

    test('should filter by beds and baths', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?beds=3&baths=2.5')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[0][0]).toContain('L_Keyword2 = ?');
      expect(calls[0][0]).toContain('LM_Dec_3 = ?');
      expect(calls[0][1]).toContain(3);
      expect(calls[0][1]).toContain(2.5);
    });

    test('should sort by price', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[]]);

      await request(app)
        .get('/api/properties?sortBy=price&sortOrder=desc')
        .expect(200);

      const calls = mockQuery.mock.calls;
      expect(calls[1][0]).toContain('ORDER BY');
      expect(calls[1][0]).toContain('L_SystemPrice');
      expect(calls[1][0]).toContain('DESC');
    });

    // test('should return 400 for invalid sortBy', async () => {
    //   const response = await request(app)
    //     .get('/api/properties?sortBy=invalid')
    //     .expect(400);

    //   expect(response.body.error).toBe('Invalid query parameters');
    //   expect(response.body.details).toContain('Invalid sortBy value');
    // });

    // test('should return 400 for invalid limit', async () => {
    //   const response = await request(app)
    //     .get('/api/properties?limit=200')
    //     .expect(400);

    //   expect(response.body.error).toBe('Invalid query parameters');
    // });

    // test('should handle database errors gracefully', async () => {
    //   mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

    //   const response = await request(app)
    //     .get('/api/properties')
    //     .expect(500);

    //   expect(response.body.error).toBe('Internal Server Error');
    // });
  });

  describe('GET /api/properties/:id', () => {
    test('should return property by ID', async () => {
      const mockProperty = {
        L_ListingID: '1234567890',
        L_City: 'Irvine',
        L_SystemPrice: 750000
      };

      mockQuery.mockResolvedValueOnce([[mockProperty]]);

      const response = await request(app)
        .get('/api/properties/1234567890')
        .expect(200);

      expect(response.body).toEqual(mockProperty);
    });

    test('should return 404 for non-existent property', async () => {
      mockQuery.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/9999999999')
        .expect(404);

      expect(response.body.error).toBe('Property not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/properties/invalid')
        .expect(400);

      expect(response.body.error).toBe('id has to be a string of integers');
    });

    // test('should handle database error', async () => {
    //   mockQuery.mockRejectedValueOnce(new Error('Database error'));

    //   const response = await request(app)
    //     .get('/api/properties/1234567890')
    //     .expect(500);

    //   expect(response.body.error).toBe('Internal Server Error');
    // });
  });

  describe('GET /api/properties/:id/openhouses', () => {
    test('should return open houses for property', async () => {
      const mockOpenHouses = [
        { OH_StartDate: '2026-08-01', OH_StartTime: '10:00', OH_EndTime: '12:00' },
        { OH_StartDate: '2026-08-02', OH_StartTime: '14:00', OH_EndTime: '16:00' }
      ];

      mockQuery
        .mockResolvedValueOnce([[{ L_ListingID: '1234567890' }]])
        .mockResolvedValueOnce([mockOpenHouses]);

      const response = await request(app)
        .get('/api/properties/1234567890/openhouses')
        .expect(200);

      expect(response.body).toEqual(mockOpenHouses);
    });

    test('should return empty array when no open houses', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ L_ListingID: '1234567890' }]])
        .mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/1234567890/openhouses')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('should return 404 for non-existent property', async () => {
      mockQuery.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/9999999999/openhouses')
        .expect(404);

      expect(response.body.error).toBe('Property not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/properties/invalid/openhouses')
        .expect(400);

      expect(response.body.error).toBe('id has to be a string of integers');
    });
  });
});