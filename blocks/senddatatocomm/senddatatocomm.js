export default function decorate(block) {
  const button = document.createElement('button');
  button.textContent = 'Fetch Product from API Mesh';
  block.appendChild(button);

  const resultDisplay = document.createElement('pre');
  block.appendChild(resultDisplay);

  button.addEventListener('click', async () => {
    const endpoint = 'https://edge-sandbox-graph.adobe.io/api/0804747e-2944-4ef2-b5f7-e1b7a1d6bc32/graphql';
    const apiKey = 'f75115a1f5c64e61a50e050543da9545';

    const query = `
      query {
        products(filter: { sku: { eq: "SUN90" } }) {
          items {
            name
            sku
            url_key
            type_id
            image {
              url
              label
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        resultDisplay.textContent = '❌ Failed to fetch product data.';
      } else {
        console.log('Product data:', data);
        resultDisplay.textContent = JSON.stringify(data, null, 2);
      }
    } catch (err) {
      console.error(err);
      resultDisplay.textContent = '⚠️ Error occurred during fetch.';
    }
  });
}
