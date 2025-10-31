import { useState, useEffect } from 'react';
import { brandAPI } from '../services/api';
import Layout from '../components/Layout';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await brandAPI.getAll();
      setBrands(response.data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => {
    setEditingBrand(null);
    setFormData({ name: '', category: '', description: '' });
    setShowForm(true);
    setError('');
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      category: brand.category || '',
      description: brand.description || ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandAPI.delete(id);
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Brand name is required');
      return;
    }

    try {
      if (editingBrand) {
        await brandAPI.update(editingBrand.id, formData);
      } else {
        await brandAPI.create(formData);
      }
      setShowForm(false);
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      setError(error.response?.data?.error || 'Failed to save brand');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Brands</h1>
          <button onClick={handleAddBrand} className="btn-primary">
            Add Brand
          </button>
        </div>

        {showForm && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter category"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Enter description"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {brands.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No brands found</p>
            <p className="text-gray-400 mt-2">Add your first brand to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id} className="card hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                
                {brand.category && (
                  <p className="text-sm text-gray-600 mb-2">
                    Category: <span className="font-medium">{brand.category}</span>
                  </p>
                )}

                {brand.description && (
                  <p className="text-gray-700 mb-4">{brand.description}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditBrand(brand)}
                    className="btn-secondary flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    className="btn-danger flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Brands;
