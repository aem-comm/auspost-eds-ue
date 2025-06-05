export default function decorate(block) {
  // Create Button
  const button = document.createElement('button');
  button.textContent = 'Create Customer via API Mesh';
  button.style.padding = '1em';
  button.style.marginBottom = '1em';
  block.appendChild(button);

  // Create Output Display
  const resultDisplay = document.createElement('pre');
  resultDisplay.style.backgroundColor = '#f5f5f5';
  resultDisplay.style.padding = '1em';
  resultDisplay.style.whiteSpace = 'pre-wrap';
  block.appendChild(resultDisplay);

  // Button click handler
  button.addEventListener('click', async () => {
    const endpoint = 'https://edge-sandbox-graph.adobe.io/api/0804747e-2944-4ef2-b5f7-e1b7a1d6bc32/graphql';
    const token = 'f75115a1f5c64e61a50e050543da9545';

    const firstname = block.dataset.firstname || 'John';
    const lastname = block.dataset.lastname || 'Doe';
    const email = block.dataset.email || 'john.doe@example.com';
    const password = block.dataset.password || 'MySecurePassword123';

    const query = `
      mutation {
        createCustomerV2(
          input: {
            firstname: "${firstname}"
            lastname: "${lastname}"
            email: "${email}"
            password: "${password}"
          }
        ) {
          customer {
            firstname
            lastname
            email
            is_subscribed
          }
        }
      }
    `;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.errors) {
        resultDisplay.textContent = `❌ Error:\n${JSON.stringify(data.errors, null, 2)}`;
      } else {
        resultDisplay.textContent = `✅ Customer Created:\n${JSON.stringify(data.data, null, 2)}`;
      }
    } catch (error) {
      resultDisplay.textContent = `⚠️ Network Error: ${error.message}`;
    }
  });
}
