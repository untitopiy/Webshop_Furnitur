import moment from 'moment';

export default (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'token',
    {
      refresh_token: {
        type: DataTypes.TEXT,
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
    }
  );

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      onDelete: 'cascade',
      foreignKey: 'user_id',
    });
  };

  return Token;
};
