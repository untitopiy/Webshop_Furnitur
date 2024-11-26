import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isoutofstock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('created_at')).format(
            'YYYY-MM-DD[T]HH:mm:ss.SSS'
          );
        },
      },
    },
    {
      paranoid: true,
      tableName: 'products',
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'user_id',
    });
    Product.belongsTo(models.Category, {
      onDelete: 'cascade',
      foreignKey: 'category_id',
    });
    Product.belongsToMany(models.Order, {
      through: models.Orderitem,
      onDelete: 'cascade',
      foreignKey: 'product_id',
      as: 'orderItems',
    });
  };

  return Product;
};
