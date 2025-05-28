import { readBlockConfig, getConfig } from '../../scripts/aem.js';

const productTeaserQuery = `query productTeaser($sku: String!) {
  listMagentoProduct(filter: { sku: { eq: $sku } }) {
    items {
      sku
      name
      price {
        regularPrice {
          amount {
            value
            currency
          }
        }
      }
      image {
        url
        label
      }
    }
  }
}`;

function renderPlaceholder(config, block) {
  block.textContent = '';
  block.appendChild(document.createRange().createContextualFragment(`
    <div class="image">
      <div class="placeholder"></div>
    </div>
    <div class="details">
      <h1></h1>
      <div class="price"></div>
      <div class="actions">
        ${config['details-button'] ? '<a href="#" class="button primary disabled">Details</a>' : ''}
        ${config['cart-button'] ? '<button class="secondary" disabled>Add to Cart</button>' : ''}
      </div>
    </div>
  `));
}

function renderImage(image, size = 250) {
  const { url, label } = image;
  const imgUrl = url.startsWith('http') ? url : `https://${url}`;
  return document.createRange().createContextualFragment(`
    <picture>
      <img height="${size}" width="${size}" src="${imgUrl}" loading="eager" alt="${label}" />
    </picture>
  `);
}

function renderProduct(product, config, block) {
  const {
    name, sku, price, image,
  } = product;

  const currency = price?.regularPrice?.amount?.currency || 'USD';
  const value = price?.regularPrice?.amount?.value || 0;

  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  block.textContent = '';
  const fragment = document.createRange().createContextualFragment(`
    <div class="image">
    </div>
    <div class="details">
      <h1>${name}</h1>
      <div class="price">${priceFormatter.format(value)}</div>
      <div class="actions">
        ${config['details-button'] ? `<a href="/products/${sku}" class="button primary">Details</a>` : ''}
        ${config['cart-button'] ? '<button class="add-to-cart secondary">Add to Cart</button>' : ''}
      </div>
    </div>
  `);

  fragment.querySelector('.image').appendChild(renderImage(image, 250));

  block.appendChild(fragment);
}

async function fetchProductFromApiMesh(sku) {
  const cfg = getConfig();
  const apiMeshEndpoint = cfg['commerce-api-mesh-endpoint'];
  const apiMeshHeaders = cfg['headers']['api-mesh'];

  const response = await fetch(apiMeshEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiMeshHeaders['x-api-key'],
    },
    body: JSON.stringify({
      query: productTeaserQuery,
      variables: { sku },
    }),
  });

  if (!response.ok) {
    console.error('Failed to fetch product from API Mesh');
    return null;
  }

  const json = await response.json();
  const item = json?.data?.listMagentoProduct?.items?.[0];
  return item || null;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  config['details-button'] = config['details-button'] === true || config['details-button'] === 'true';
  config['cart-button'] = config['cart-button'] === true || config['cart-button'] === 'true';

  renderPlaceholder(config, block);

  const product = await fetchProductFromApiMesh(config.sku);
  if (!product) {
    console.warn('Product not found for SKU:', config.sku);
    return;
  }

  renderProduct(product, config, block);
}
