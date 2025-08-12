import Layout from '../../components/Layout';
import { featuredProducts } from '../../data/products';
import CategoryClientPage from '../../components/CategoryClientPage';

export default function CategoryPage({ params }) {
  const { category } = params;
  const products = featuredProducts[category] || [];

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
