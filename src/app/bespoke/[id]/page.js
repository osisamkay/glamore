import Layout from '../../../components/Layout';
import BespokeProductDetailClientPage from '../../../components/BespokeProductDetailClientPage';

// Fetch product data from API
async function getProduct(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'https://ggfashions.netlify.app');
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      return null;
    }
    
    const product = await res.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function BespokeProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Bespoke Product not found</h1>
          <p>Sorry, we couldn't find the bespoke product you're looking for.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <BespokeProductDetailClientPage product={product} />
      </div>
    </Layout>
  );
}
