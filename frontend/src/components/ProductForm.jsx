import { useState, useEffect } from 'react';
import { productAPI, getCountries } from '../services/api';

const ProductForm = ({ product, brands, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    purchaseDate: '',
    productionDate: '',
    expirationDate: '',
    expirationPeriod: '',
    price: '',
    benefits: '',
    capacity: '',
    capacityUnit: 'ml',
    countryOfOrigin: '',
    quantityPurchased: '1',
    notes: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanningImage, setScanningImage] = useState(false);

  useEffect(() => {
    fetchCountries();
    
    if (product) {
      setFormData({
        name: product.name || '',
        brandId: product.brandId || '',
        purchaseDate: product.purchaseDate ? product.purchaseDate.split('T')[0] : '',
        productionDate: product.productionDate ? product.productionDate.split('T')[0] : '',
        expirationDate: product.expirationDate ? product.expirationDate.split('T')[0] : '',
        expirationPeriod: product.expirationPeriod || '',
        price: product.price || '',
        benefits: product.benefits || '',
        capacity: product.capacity || '',
        capacityUnit: product.capacityUnit || 'ml',
        countryOfOrigin: product.countryOfOrigin || '',
        quantityPurchased: '1',
        notes: ''
      });
      
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product]);

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanImage = async () => {
    if (!imageFile) {
      alert('Please select an image first');
      return;
    }

    setScanningImage(true);
    const scanFormData = new FormData();
    scanFormData.append('image', imageFile);

    try {
      const response = await productAPI.scan(scanFormData);
      const { suggestions } = response.data.data;
      
      if (suggestions.possibleDates && suggestions.possibleDates.length > 0) {
        alert(`Detected dates: ${suggestions.possibleDates.join(', ')}\nPlease manually select the appropriate dates.`);
      }
      
      if (suggestions.possiblePrices && suggestions.possiblePrices.length > 0) {
        const price = suggestions.possiblePrices[0].replace('$', '');
        setFormData(prev => ({ ...prev, price }));
      }
      
      if (suggestions.possibleCapacities && suggestions.possibleCapacities.length > 0) {
        alert(`Detected capacities: ${suggestions.possibleCapacities.join(', ')}\nPlease manually enter the capacity.`);
      }
      
      alert('Image scanned! Check the form for auto-filled values.');
    } catch (error) {
      console.error('Error scanning image:', error);
      alert('Failed to scan image. Please enter details manually.');
    } finally {
      setScanningImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name) {
      setError('Product name is required');
      setLoading(false);
      return;
    }

    const submitFormData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        submitFormData.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      submitFormData.append('image', imageFile);
    }

    try {
      if (product) {
        await productAPI.update(product.id, submitFormData);
      } else {
        await productAPI.create(submitFormData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Brand
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Capacity
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="input-field flex-1"
                placeholder="Amount"
              />
              <select
                name="capacityUnit"
                value={formData.capacityUnit}
                onChange={handleChange}
                className="input-field w-24"
              >
                <option value="ml">ml</option>
                <option value="l">L</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="oz">oz</option>
                <option value="lb">lb</option>
                <option value="unit">unit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Country of Origin
            </label>
            <select
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Production Date
            </label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Expiration Period (days)
            </label>
            <input
              type="number"
              name="expirationPeriod"
              value={formData.expirationPeriod}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 365 for 1 year"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Quantity Purchased
            </label>
            <input
              type="number"
              name="quantityPurchased"
              value={formData.quantityPurchased}
              onChange={handleChange}
              className="input-field"
              min="1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Benefits
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Enter product benefits"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Additional notes"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {imageFile && (
              <button
                type="button"
                onClick={handleScanImage}
                disabled={scanningImage}
                className="btn-secondary mt-2"
              >
                {scanningImage ? 'Scanning...' : 'Scan Image for Info'}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
