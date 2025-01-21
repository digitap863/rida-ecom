import Image from 'next/image';
import Link from 'next/link';

export const RelatedProducts = ({ products }) => {
  if (!products?.length) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/${product.category.category}/${product.subcategory.subcategory}/${product.manufacturer.slug}/${product.slug}`}
            className="group"
          >
            <div className="border rounded-lg p-2 sm:p-4 transition-all duration-300 hover:shadow-lg">
              <div className="aspect-square relative mb-2 sm:mb-3 bg-transparent mix-blend-multiply">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg mix-blend-multiply p-2"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};