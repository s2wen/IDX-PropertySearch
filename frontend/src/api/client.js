async function apiFetch(url, options={}){
    let response;
    try{
        response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
        });
    }catch{
        throw new Error('Server Error');
    }

    if(!response.ok){
        let errorMessage;
        try{
            const errorData = await response.json();
            errorMessage = typeof errorData === 'object' 
                ? (errorData.message || errorData.error || JSON.stringify(errorData))
                : errorData;
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }catch(err){
            errorMessage = (err.text && typeof err.text === 'function') 
            ? await err.text() 
            : (err.message || response?.statusText || 'Internal Server Error');
        }
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }
    return response.json();
}

export async function fetchProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') query.append(key, value);
    });
    return apiFetch(`/api/properties?${query}`);
}

export async function fetchPropertyDetail(id) {
    if (!id || !/^\d{9,10}$/.test(String(id))) {
        throw new Error('Invalid property ID');
    }
    return apiFetch(`/api/properties/${id}`);
}

export async function fetchPropertyOpenHouses(id) {
    if (!id || !/^\d{9,10}$/.test(String(id))) {
        throw new Error('Invalid property ID');
    }
    return apiFetch(`/api/properties/${id}/openhouses`);
}