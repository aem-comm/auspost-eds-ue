export default function decorate(block) {
  const button = document.createElement('button');
  button.textContent = 'Send Test Data to Commerce';
  block.appendChild(button);

  const statusMsg = document.createElement('p');
  block.appendChild(statusMsg);

  button.addEventListener('click', async () => {
    const mutation = `
      mutation {
        createProductReview(
          input: {
            productId: "1234"
            email: "john@example.com"
            nickname: "Tester"
            rating: 5
            review: "This is a hardcoded test review from EDS block."
          }
        ) {
          review {
            id
            status
          }
        }
      }
    `;

    try {
      const response = await fetch('https://your-api-mesh-endpoint/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_MESH_ACCESS_TOKEN'
        },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error(result.errors);
        statusMsg.textContent = '❌ Failed to send data.';
      } else {
        console.log(result.data);
        statusMsg.textContent = '✅ Data sent successfully!';
      }
    } catch (err) {
      console.error(err);
      statusMsg.textContent = '⚠️ Error occurred.';
    }
  });
}
