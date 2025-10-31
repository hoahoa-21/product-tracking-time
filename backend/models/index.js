const sequelize = require('../config/database');
const User = require('./User');
const Brand = require('./Brand');
const Product = require('./Product');
const ProductTimeTracking = require('./ProductTimeTracking');
const ExportTemplate = require('./ExportTemplate');

// Define associations
User.hasMany(Brand, { foreignKey: 'userId', onDelete: 'CASCADE' });
Brand.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Product, { foreignKey: 'userId', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'userId' });

Brand.hasMany(Product, { foreignKey: 'brandId', onDelete: 'SET NULL' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });

Product.hasMany(ProductTimeTracking, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductTimeTracking.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(ExportTemplate, { foreignKey: 'userId', onDelete: 'CASCADE' });
ExportTemplate.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Brand,
  Product,
  ProductTimeTracking,
  ExportTemplate
};
