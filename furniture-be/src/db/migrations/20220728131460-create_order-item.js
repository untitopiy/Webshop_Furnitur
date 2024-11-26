/* eslint-disable no-undef */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orderitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      product_id: {
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        type: Sequelize.DataTypes.INTEGER,
      },
      order_id: {
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        type: Sequelize.DataTypes.INTEGER,
      },
      count: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      deleted_at: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('orderitems');
  },
};
