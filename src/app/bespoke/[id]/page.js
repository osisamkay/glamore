import Layout from '../../../components/Layout';
import BespokeProductDetailClientPage from '../../../components/BespokeProductDetailClientPage';

// Fetch product data from API
async function getProduct(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'https://ggfashions.netlify.app');
    
    console.log(`Fetching bespoke product from: ${baseUrl}/api/products/${id}`);
    
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    console.log('API response data:', data);
    
    return data.success ? data.product : data;
  } catch (error) {
    console.error('Error fetching bespoke product:', error);
    return null;
  }
}

export default async function BespokeProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || !product.id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Bespoke Product not found</h1>
          <p>Sorry, we couldn't find the bespoke product you're looking for.</p>
          <p className="text-sm text-gray-500 mt-2">Product ID: {id}</p>
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
