import moment from 'moment';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
          unique: true,
      },
      role: {
        type: DataTypes.STRING,
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
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Token, { onDelete: 'cascade', foreignKey: 'user_id' });
    User.hasMany(models.Order, { onDelete: 'cascade', foreignKey: 'user_id' });
    User.hasMany(models.Product, { onDelete: 'cascade', foreignKey: 'user_id' });
  };

  return User;
};
