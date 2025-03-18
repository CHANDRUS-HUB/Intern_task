const { DataTypes } = require("sequelize");
const sequelize = require("../config/userdata");

const UserDB = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false ,
        validate: { 
            len: [1, 10] 
        }
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'users', 
    timestamps: false
});

module.exports = UserDB;
