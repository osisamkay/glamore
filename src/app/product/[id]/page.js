import Layout from '../../../components/Layout';
import { featuredProducts } from '../../../data/products';
import ProductDetailClientPage from '../../../components/ProductDetailClientPage';

// Helper function to find a product by its ID across all categories
const findProductById = (id) => {
  const productId = parseInt(id, 10);
  for (const category in featuredProducts) {
    const product = featuredProducts[category].find(p => p.id === productId);
    if (product) {
      return product;
    }
  }
  return null;
};

export default function ProductPage({ params }) {
  const { id } = params;
  const product = findProductById(id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p>Sorry, we couldn't find the product you're looking for.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <ProductDetailClientPage product={product} />
      </div>
    </Layout>
  );
}
