const { Product, Brand, ProductTimeTracking, ExportTemplate } = require('../models');
const ExcelJS = require('exceljs');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const exportProducts = async (req, res) => {
  try {
    const { fields, format = 'excel', templateId } = req.body;

    let selectedFields = fields;

    if (templateId) {
      const template = await ExportTemplate.findOne({
        where: { 
          id: templateId,
          userId: req.user.id
        }
      });

      if (template) {
        selectedFields = template.fields;
      }
    }

    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ error: 'No fields selected for export' });
    }

    const products = await Product.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Brand },
        { model: ProductTimeTracking }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedData = products.map(product => {
      const data = {};
      
      selectedFields.forEach(field => {
        switch(field) {
          case 'name':
            data.name = product.name;
            break;
          case 'brand':
            data.brand = product.Brand ? product.Brand.name : '';
            break;
          case 'purchaseDate':
            data.purchaseDate = product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : '';
            break;
          case 'productionDate':
            data.productionDate = product.productionDate ? new Date(product.productionDate).toLocaleDateString() : '';
            break;
          case 'expirationDate':
            data.expirationDate = product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : '';
            break;
          case 'price':
            data.price = product.price || '';
            break;
          case 'capacity':
            data.capacity = product.capacity ? `${product.capacity} ${product.capacityUnit}` : '';
            break;
          case 'countryOfOrigin':
            data.countryOfOrigin = product.countryOfOrigin || '';
            break;
          case 'benefits':
            data.benefits = product.benefits || '';
            break;
          case 'quantityPurchased':
            const totalQuantity = product.ProductTimeTrackings?.reduce((sum, track) => sum + track.quantityPurchased, 0) || 0;
            data.quantityPurchased = totalQuantity;
            break;
        }
      });
      
      return data;
    });

    let filePath;
    const timestamp = Date.now();

    switch(format) {
      case 'excel':
        filePath = await generateExcel(formattedData, selectedFields, timestamp);
        break;
      case 'pdf':
        filePath = await generatePDF(formattedData, selectedFields, timestamp);
        break;
      case 'csv':
        filePath = await generateCSV(formattedData, selectedFields, timestamp);
        break;
      default:
        return res.status(400).json({ error: 'Invalid export format' });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export products', details: error.message });
  }
};

const generateExcel = async (data, fields, timestamp) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Products');

  worksheet.columns = fields.map(field => ({
    header: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
    key: field,
    width: 20
  }));

  worksheet.addRows(data);

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  const filePath = path.join(__dirname, '..', 'uploads', `products_export_${timestamp}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  
  return filePath;
};

const generatePDF = async (data, fields, timestamp) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Products Export', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  const headers = fields.map(field => 
    field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
  );

  const rows = data.map(item => fields.map(field => item[field] || ''));

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  const filePath = path.join(__dirname, '..', 'uploads', `products_export_${timestamp}.pdf`);
  doc.save(filePath);
  
  return filePath;
};

const generateCSV = async (data, fields, timestamp) => {
  const filePath = path.join(__dirname, '..', 'uploads', `products_export_${timestamp}.csv`);
  
  const csvWriter = createCsvWriter({
    path: filePath,
    header: fields.map(field => ({
      id: field,
      title: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
    }))
  });

  await csvWriter.writeRecords(data);
  
  return filePath;
};

const saveTemplate = async (req, res) => {
  try {
    const { name, fields, format } = req.body;

    if (!name || !fields || !format) {
      return res.status(400).json({ error: 'Name, fields, and format are required' });
    }

    const template = await ExportTemplate.create({
      userId: req.user.id,
      name,
      fields,
      format
    });

    res.status(201).json({
      message: 'Export template saved successfully',
      template
    });
  } catch (error) {
    console.error('Save template error:', error);
    res.status(500).json({ error: 'Failed to save template' });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await ExportTemplate.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const template = await ExportTemplate.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await template.destroy();

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
};

module.exports = {
  exportProducts,
  saveTemplate,
  getTemplates,
  deleteTemplate
};
