import { format } from 'date-fns';

const ProductList = ({ products, onEdit, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const daysUntilExpiration = Math.ceil(
      (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration > 0 && daysUntilExpiration <= 30;
  };

  if (products.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 mt-2">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="card hover:shadow-lg transition-shadow">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          
          {product.Brand && (
            <p className="text-sm text-gray-600 mb-2">
              Brand: <span className="font-medium">{product.Brand.name}</span>
            </p>
          )}

          <div className="space-y-1 text-sm mb-4">
            {product.price && (
              <p className="text-gray-700">
                Price: <span className="font-medium">${product.price}</span>
              </p>
            )}
            
            {product.capacity && (
              <p className="text-gray-700">
                Capacity: <span className="font-medium">{product.capacity} {product.capacityUnit}</span>
              </p>
            )}
            
            {product.countryOfOrigin && (
              <p className="text-gray-700">
                Origin: <span className="font-medium">{product.countryOfOrigin}</span>
              </p>
            )}
            
            {product.purchaseDate && (
              <p className="text-gray-700">
                Purchased: <span className="font-medium">{formatDate(product.purchaseDate)}</span>
              </p>
            )}
            
            {product.expirationDate && (
              <p className={`font-medium ${
                isExpired(product.expirationDate) 
                  ? 'text-red-600' 
                  : isExpiringSoon(product.expirationDate)
                  ? 'text-orange-600'
                  : 'text-gray-700'
              }`}>
                Expires: {formatDate(product.expirationDate)}
                {isExpired(product.expirationDate) && ' (Expired)'}
                {isExpiringSoon(product.expirationDate) && ' (Expiring Soon)'}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="btn-secondary flex-1"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="btn-danger flex-1"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
