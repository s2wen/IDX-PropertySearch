import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListingsPage from './components/ListingsPage';
// import PropertyDetailPage 
import PropertyDetailPage from './components/PropertyDetailPage';
import './App.css';
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div role="alert">
          <p>Something went wrong:</p>
          <pre>{getErrorMessage(error)}</pre>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}
      >
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path = "/" element={<ListingsPage />}/>
            <Route path = "/property/:id" element={<PropertyDetailPage />}/>
          </Routes>
          
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;