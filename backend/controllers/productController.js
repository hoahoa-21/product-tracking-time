const { Product, Brand, ProductTimeTracking } = require('../models');
const { Op } = require('sequelize');
const Tesseract = require('tesseract.js');
const path = require('path');

const createProduct = async (req, res) => {
  try {
    const {
      name, purchaseDate, productionDate, expirationDate, expirationPeriod,
      price, benefits, capacity, capacityUnit, countryOfOrigin, brandId,
      quantityPurchased, notes
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      purchaseDate,
      productionDate,
      expirationDate,
      expirationPeriod,
      price,
      benefits,
      capacity,
      capacityUnit,
      countryOfOrigin,
      imageUrl,
      userId: req.user.id,
      brandId
    });

    if (quantityPurchased) {
      await ProductTimeTracking.create({
        productId: product.id,
        quantityPurchased: quantityPurchased || 1,
        notes
      });
    }

    const productWithDetails = await Product.findByPk(product.id, {
      include: [
        { model: Brand },
        { model: ProductTimeTracking }
      ]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: productWithDetails
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, brandId, sortBy = 'createdAt', order = 'DESC' } = req.query;
    
    const where = { userId: req.user.id };
    
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    if (brandId) {
      where.brandId = brandId;
    }

    const products = await Product.findAll({
      where,
      include: [
        { model: Brand },
        { model: ProductTimeTracking }
      ],
      order: [[sortBy, order]]
    });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        { model: Brand },
        { model: ProductTimeTracking }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name, purchaseDate, productionDate, expirationDate, expirationPeriod,
      price, benefits, capacity, capacityUnit, countryOfOrigin, brandId
    } = req.body;

    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (name) product.name = name;
    if (purchaseDate !== undefined) product.purchaseDate = purchaseDate;
    if (productionDate !== undefined) product.productionDate = productionDate;
    if (expirationDate !== undefined) product.expirationDate = expirationDate;
    if (expirationPeriod !== undefined) product.expirationPeriod = expirationPeriod;
    if (price !== undefined) product.price = price;
    if (benefits !== undefined) product.benefits = benefits;
    if (capacity !== undefined) product.capacity = capacity;
    if (capacityUnit !== undefined) product.capacityUnit = capacityUnit;
    if (countryOfOrigin !== undefined) product.countryOfOrigin = countryOfOrigin;
    if (brandId !== undefined) product.brandId = brandId;
    
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    await product.save();

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Brand },
        { model: ProductTimeTracking }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const scanProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = path.join(__dirname, '..', req.file.path);

    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });

    const extractedData = {
      rawText: text,
      imageUrl: `/uploads/${req.file.filename}`,
      suggestions: parseProductInfo(text)
    };

    res.json({
      message: 'Image scanned successfully',
      data: extractedData
    });
  } catch (error) {
    console.error('Scan image error:', error);
    res.status(500).json({ error: 'Failed to scan image', details: error.message });
  }
};

const parseProductInfo = (text) => {
  const suggestions = {};
  
  const datePatterns = [
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g,
    /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/g
  ];
  
  const dates = [];
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) dates.push(...matches);
  });
  
  if (dates.length > 0) {
    suggestions.possibleDates = dates;
  }
  
  const pricePattern = /\$?\d+\.?\d{0,2}/g;
  const prices = text.match(pricePattern);
  if (prices) {
    suggestions.possiblePrices = prices;
  }
  
  const capacityPattern = /(\d+\.?\d*)\s*(ml|l|g|kg|oz|lb)/gi;
  const capacities = text.match(capacityPattern);
  if (capacities) {
    suggestions.possibleCapacities = capacities;
  }
  
  return suggestions;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  scanProductImage
};
