import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render all filter inputs correctly', () => {
    render(
      <PropertyFilters 
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{}}
      />
    );

    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Baths/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply Filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Filters/i })).toBeInTheDocument();
  });

  test('should populate fields with initial filter values', () => {
    const initialFilters = {
      city: 'New York',
      zipcode: '10001',
      minPrice: '500000',
      maxPrice: '1000000',
      beds: '3',
      baths: '2.5'
    };

    render(
      <PropertyFilters 
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={initialFilters}
      />
    );

    // screen.debug();

    expect(screen.getByLabelText(/City/i)).toHaveValue('New York');
    expect(screen.getByLabelText(/ZIP Code/i)).toHaveValue('10001');
    expect(screen.getByLabelText(/Min Price/i)).toHaveValue(500000);
    expect(screen.getByLabelText(/Max Price/i)).toHaveValue(1000000);
    expect(screen.getByLabelText(/Beds/i)).toHaveValue('3');
    expect(screen.getByLabelText(/Baths/i)).toHaveValue('2.5');
  });

  test('should call onFilterChange when Apply Filters is clicked', () => {
    render(
      <PropertyFilters 
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{}}
      />
    );

    // Fill in fields
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Seattle' } });
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { target: { value: '98101' } });
    
    // Click Apply Filters
    fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      city: 'Seattle',
      zipcode: '98101'
    });
  });
});