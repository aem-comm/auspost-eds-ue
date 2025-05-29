import config from './config.json';

// Export API Mesh settings
export const apiMeshEndpoint = config.apiMeshEndpoint;
export const apiMeshApiKey = config.apiMeshApiKey;

// Existing utility functions (leave your existing ones intact)
export function renderPrice(product, formatPrice) {
  const price = product.price?.final?.amount?.value || product.priceRange?.minimum?.final?.amount?.value;
  return price !== undefined ? formatPrice(price) : '';
}

export function mapProductAcdl(product) {
  return {
    productName: product.name,
    sku: product.sku,
    price: product.price?.final?.amount?.value,
    currency: product.price?.final?.amount?.currency,
    category: product.category?.name || '',
  };
}

export function rootLink(path) {
  return `${window.location.origin}${path}`;
}
