import Layout from '../../../components/Layout';
import ProductDetailClientPage from '../../../components/ProductDetailClientPage';

// Fetch product data from API
async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.success ? data.product : data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params, searchParams }) {
  const { id } = await params;
  const { bespoke } = (await searchParams) || {};
  const product = await getProduct(id);

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
        <ProductDetailClientPage product={product} bespoke={bespoke === 'true'} />
      </div>
    </Layout>
  );
}
