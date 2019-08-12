const Sequelize = require('sequelize');
const minionModel = require('./models/minion');
const purchaseModel = require('./models/purchase');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
        
    }
);

const Minion = minionModel(sequelize, Sequelize);
const Purchase = purchaseModel(sequelize, Sequelize);
const Models = { Minion, Purchase };
const connection = {};

module.exports = async () => {
    if(connection.isConnected){
        return Models;
    }
    
    await sequelize.sync();
    await sequelize.authenticate();
    connection.isConnected = true;
    return Models;
}
