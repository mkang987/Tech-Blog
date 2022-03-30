const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/config');

class User extends Model {
  checkPassword(pass) {
    return bcrypt.compareSync(pass, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserInfo) => {
        newUserInfo.password = await bcrypt.hash(newUserInfo.password, 10);
        return newUserInfo;
      },
      beforeUpdate: async (updateUserInfo) => {
        updateUserInfo.password = await bcrypt.hash(updateUserInfo.password, 10);
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'User',
  },
);

module.exports = User;
