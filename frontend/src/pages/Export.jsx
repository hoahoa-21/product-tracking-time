import { useState, useEffect } from 'react';
import { exportAPI } from '../services/api';
import Layout from '../components/Layout';

const Export = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [format, setFormat] = useState('excel');
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const availableFields = [
    { value: 'name', label: 'Product Name' },
    { value: 'brand', label: 'Brand' },
    { value: 'purchaseDate', label: 'Purchase Date' },
    { value: 'productionDate', label: 'Production Date' },
    { value: 'expirationDate', label: 'Expiration Date' },
    { value: 'price', label: 'Price' },
    { value: 'capacity', label: 'Capacity' },
    { value: 'countryOfOrigin', label: 'Country of Origin' },
    { value: 'benefits', label: 'Benefits' },
    { value: 'quantityPurchased', label: 'Quantity Purchased' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await exportAPI.getTemplates();
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
    setError('');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedFields(template.fields);
        setFormat(template.format);
      }
    } else {
      setSelectedFields([]);
      setFormat('excel');
    }
  };

  const handleExport = async () => {
    setError('');
    setSuccess('');

    if (selectedFields.length === 0) {
      setError('Please select at least one field to export');
      return;
    }

    setLoading(true);

    try {
      const response = await exportAPI.exportProducts({
        fields: selectedFields,
        format,
        templateId: selectedTemplate || undefined
      });

      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `products_export.${extension}`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('Export completed successfully!');
    } catch (error) {
      console.error('Error exporting:', error);
      setError('Failed to export products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    setError('');
    setSuccess('');

    if (!templateName) {
      setError('Please enter a template name');
      return;
    }

    if (selectedFields.length === 0) {
      setError('Please select at least one field');
      return;
    }

    try {
      await exportAPI.saveTemplate({
        name: templateName,
        fields: selectedFields,
        format
      });
      
      setSuccess('Template saved successfully!');
      setTemplateName('');
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await exportAPI.deleteTemplate(id);
        fetchTemplates();
        if (selectedTemplate === id) {
          setSelectedTemplate('');
          setSelectedFields([]);
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Export Products</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Select Fields to Export</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableFields.map((field) => (
                  <label
                    key={field.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.value)}
                      onChange={() => handleFieldToggle(field.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{field.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Export Format</h2>
              
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="excel"
                    checked={format === 'excel'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Excel (.xlsx)</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pdf"
                    checked={format === 'pdf'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>PDF (.pdf)</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="csv"
                    checked={format === 'csv'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>CSV (.csv)</span>
                </label>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Save as Template</h2>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSaveTemplate}
                  className="btn-secondary"
                >
                  Save Template
                </button>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading || selectedFields.length === 0}
              className="btn-primary w-full text-lg py-3"
            >
              {loading ? 'Exporting...' : 'Export Products'}
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Saved Templates</h2>
              
              {templates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No saved templates
                </p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleTemplateSelect('')}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedTemplate === '' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">Custom Selection</div>
                  </button>
                  
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`px-3 py-2 rounded transition ${
                        selectedTemplate === template.id 
                          ? 'bg-blue-100 border-2 border-blue-500' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <button
                          onClick={() => handleTemplateSelect(template.id)}
                          className="flex-1 text-left"
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600">
                            {template.format.toUpperCase()} • {template.fields.length} fields
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Export;
