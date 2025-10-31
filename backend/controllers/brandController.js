const { Brand } = require('../models');

const createBrand = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    const brand = await Brand.create({
      name,
      category,
      description,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Brand created successfully',
      brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ brands });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ brand });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const brand = await Brand.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    if (name) brand.name = name;
    if (category !== undefined) brand.category = category;
    if (description !== undefined) brand.description = description;

    await brand.save();

    res.json({
      message: 'Brand updated successfully',
      brand
    });
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    await brand.destroy();

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand
};
