const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductTimeTracking = sequelize.define('ProductTimeTracking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantityPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'product_time_tracking',
  timestamps: true
});

module.exports = ProductTimeTracking;
