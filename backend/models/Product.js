const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  productionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expirationPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Expiration period in days'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  capacityUnit: {
    type: DataTypes.ENUM('ml', 'l', 'g', 'kg', 'oz', 'lb', 'unit'),
    allowNull: true,
    defaultValue: 'ml'
  },
  countryOfOrigin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  brandId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'brands',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
