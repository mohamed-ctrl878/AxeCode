/**
 * A shared fetch wrapper for making API requests.
 */
export const fetchWrapper = async (url, useToken = true, contentType = 'application/json', method = 'GET', body = null) => {
    const headers = {};

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    const config = {
        method,
        headers,
        credentials: useToken ? 'include' : 'same-origin',
    };

    if (body && method !== 'GET') {
        config.body = contentType === 'application/json' ? JSON.stringify(body) : body;
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('Fetch Wrapper Error:', error);
        throw error;
    }
};
