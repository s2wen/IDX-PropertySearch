import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from './PropertyCard';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('PropertyCard', () => {
  const mockProperty = {
    L_ListingID: '1234567890',
    L_SystemPrice: 750000,
    L_Address: '123 Main St',
    L_City: 'New York',
    L_State: 'NY',
    L_Zip: '10001',
    L_Keyword2: '3',
    LM_Dec_3: '2.5',
    L_SqFtTotal: 1800,
    L_YearBuilt: 1995,
    L_Photos: ['image1.jpg', 'image2.jpg']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders property data correctly', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('$750,000')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, New York, NY, 10001')).toBeInTheDocument();
    expect(screen.getByText('3 beds')).toBeInTheDocument();
    expect(screen.getByText('2.5 baths')).toBeInTheDocument();
    expect(screen.getByText('1,800 sqft')).toBeInTheDocument();
    expect(screen.getByText('Built 1995')).toBeInTheDocument();
  });

  test('clicking card navigates to detail page', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/property/1234567890');
  });

  test('handles missing data gracefully', () => {
    const minimalProperty = {
      L_ListingID: '1234567890'
    };

    renderWithRouter(<PropertyCard property={minimalProperty} />);

    expect(screen.getByText('Price not available')).toBeInTheDocument();
    expect(screen.getByText('Address not available')).toBeInTheDocument();
    expect(screen.getByText('— beds')).toBeInTheDocument();
    expect(screen.getByText('— baths')).toBeInTheDocument();
    expect(screen.getByText('— sqft')).toBeInTheDocument();
    expect(screen.getByText('Built —')).toBeInTheDocument();
  });

  test('uses id fallback when L_ListingID is not available', () => {
    const propertyWithId = {
      id: '9876543210',
      L_SystemPrice: 500000
    };

    renderWithRouter(<PropertyCard property={propertyWithId} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/property/9876543210');
  });

  test('formats price with commas', () => {
    const highPriceProperty = {
      ...mockProperty,
      L_SystemPrice: 1000000
    };

    renderWithRouter(<PropertyCard property={highPriceProperty} />);
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
  });
});