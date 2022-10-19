const Database = require('./database');
const { DataTypes } = require('sequelize');

const loadModel = async () => {
    const connection = await Database.getConnection();
    const model = connection.define('User', {
        id: {
            type: DataTypes.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        expired: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        token: {
            type: DataTypes.STRING
        },
        email_token: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'users'
    });

    await model.sync();
    return model;
}

module.exports = {
    loadModel
}