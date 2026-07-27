import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the API
jest.mock('./api/client', () => ({
  fetchProperties: jest.fn().mockResolvedValue({
    total: 0,
    limit: 20,
    offset: 0,
    result: []
  })
}));

describe('App', () => {
  test('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading properties…/i)).toBeInTheDocument();
  });

  test('renders property listings page after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Property Listings/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('shows property count after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Showing 0 of 0 properties/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});