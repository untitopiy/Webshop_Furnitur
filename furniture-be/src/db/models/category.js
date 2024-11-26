import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'category',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
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
      paranoid: false,
      tableName: 'categories',
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      onDelete: 'cascade',
      foreignKey: 'category_id',
    });
  };

  return Category;
};
