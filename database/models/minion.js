module.exports = (sequelize, type) => {
    return sequelize.define('minion', {
        id:{
            type : type.INTEGER,
            primaryKey: true
        },
        name: type.STRING,
        price: type.INTEGER
    });
}