import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'order',
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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
      tableName: 'orders',
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'user_id',
    });
    Order.belongsToMany(models.Product, {
      through: models.Orderitem,
      onDelete: 'cascade',
      foreignKey: 'order_id',
      as: 'orderItems',
    });
  };

  return Order;
};
