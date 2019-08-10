const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASS,
    {
        host: process.env.MYSQLHOST,
        dialect: 'mysql',
        port: process.env.MYSQLPORT,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 20000,
            handleDisconnects: true
        },
        dialectOptions: {
            requestTimeout: 100000
        },
        define: {
            freezeTableName: true
        }
    }
);

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;