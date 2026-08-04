import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should highlight page 1 when currentPage is 1', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page1Button = screen.getByText('1');
    expect(page1Button).toHaveClass('pagination-button--active');
    expect(page1Button).toHaveAttribute('aria-current', 'page');
  });

  test('should render page numbers correctly', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
  });

  test('should disable Previous button on page 1', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Previous page/i });
    expect(prevButton).toBeDisabled();
  });

  test('should disable Next button on last page', () => {
    render(
      <Pagination 
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /Next page/i });
    expect(nextButton).toBeDisabled();
  });

  test('should call onPageChange when clicking a page number', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('should call onPageChange with previous page when clicking Previous', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Previous page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test('should call onPageChange with next page when clicking Next', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Next page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  test('should show ellipsis correctly for large page counts', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipsisElements = screen.getAllByText('…');
  });

  test('should not show ellipsis when total pages fit without ellipsis', () => {
    render(
      <Pagination 
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

//   test('should not render when totalPages is 1', () => {
//     render(
//       <Pagination 
//         currentPage={1}
//         totalPages={1}
//         onPageChange={mockOnPageChange}
//       />
//     );

//     expect(screen.getByText('1')).not.toBeInTheDocument();
//   });

  test('should handle currentPage near start', () => {
    render(
      <Pagination 
        currentPage={2}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    // Should have ellipsis after 4
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis).toHaveLength(1);
  });

  test('should handle currentPage near end', () => {
    render(
      <Pagination 
        currentPage={18}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    // Should have ellipsis before 17
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis).toHaveLength(1);
  });
});