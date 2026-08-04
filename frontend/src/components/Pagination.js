import './Pagination.css';

export default function Pagination({currentPage, totalPages, onPageChange}){
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++){
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)){
                range.push(i);
            }
        }

        range.forEach((i)=>{
            if(l){
                if(i-l===2){
                    rangeWithDots.push(l+1);
                }else if(i-l!==1){
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l=i;
        });

        return rangeWithDots;
    }

    const pageNumbers = getPageNumbers();

    return(
        <nav className="pagination" aria-label="Property listings pagination">
            <ul className="pagination-list">
                <li>
                    <button
                        className="pagination-button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page">
                            Previous
                    </button>
                </li>

                {pageNumbers.map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <span className="pagination-ellipsis">…</span>
                        ) : (
                            <button
                                className={`pagination-button ${page === currentPage ? 'pagination-button--active' : ''}`}
                                onClick={() => onPageChange(page)}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li>
                    <button
                        className="pagination-button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page">
                            Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}