import Layout from '../../components/Layout';
import CategoryClientPage from '../../components/CategoryClientPage';

// Fetch products by category from API
async function getCategoryProducts(category) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'https://ggfashions.netlify.app');
    const res = await fetch(`${baseUrl}/api/products?category=${category}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const products = await getCategoryProducts(category);

  // A simple safeguard against invalid categories
  if (products.length === 0) {
    return (
      <Layout>
        <div className="container max-w-[1324px] mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p>Sorry, we couldn't find any products in the "{category}" category.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-[1324px] mt-43 mx-auto px-4 py-8">
        <CategoryClientPage initialProducts={products} category={category} />
      </div>
    </Layout>
  );
}
