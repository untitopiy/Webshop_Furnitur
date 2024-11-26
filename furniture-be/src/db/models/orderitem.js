import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Orderitem = sequelize.define(
    'orderitem',
    {
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'orderitems',
    }
  );

  Orderitem.associate = (models) => {
    Orderitem.belongsTo(models.Order, {
      foreignKey: 'order_id',
    });
    Orderitem.belongsTo(models.Product, {
      foreignKey: 'product_id',
    });
  };

  return Orderitem;
};
