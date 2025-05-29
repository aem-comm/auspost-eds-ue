import config from '../config';

export async function performCatalogServiceQuery(query, variables) {
    const commerceEndpoint = config.public.default['commerce-endpoint'];
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': config.public.default.headers.all['x-api-key']
    };

    try {
        const response = await fetch(commerceEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables
            })
        });

        const json = await response.json();

        if (json.errors) {
            console.error('GraphQL errors:', json.errors);
        }

        return json.data;
    } catch (error) {
        console.error('GraphQL request failed:', error);
        throw error;
    }
}
