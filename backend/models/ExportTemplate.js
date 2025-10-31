const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExportTemplate = sequelize.define('ExportTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fields: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of field names to export'
  },
  format: {
    type: DataTypes.ENUM('excel', 'pdf', 'csv'),
    allowNull: false,
    defaultValue: 'excel'
  }
}, {
  tableName: 'export_templates',
  timestamps: true
});

module.exports = ExportTemplate;
