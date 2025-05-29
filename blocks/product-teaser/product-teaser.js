import React, { useEffect, useState } from 'react';
import { performCatalogServiceQuery } from '../utils/commerce';

const PRODUCT_QUERY = `
    query getProductBySku($sku: String!) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                name
                sku
                description {
                    html
                }
                price_range {
                    minimum_price {
                        regular_price {
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
    }
`;

export default function ProductTeaser({ sku }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await performCatalogServiceQuery(PRODUCT_QUERY, { sku });
                const productItem = data.products.items[0];
                setProduct(productItem);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }

        if (sku) {
            fetchProduct();
        }
    }, [sku]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <div className="product-teaser">
            <h2>{product.name}</h2>
            <img src={product.image.url} alt={product.image.label || product.name} />
            <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
            <p>
                Price: {product.price_range.minimum_price.regular_price.value}{' '}
                {product.price_range.minimum_price.regular_price.currency}
            </p>
        </div>
    );
}
