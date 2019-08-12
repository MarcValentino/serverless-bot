
module.exports = (sequelize, type) => {
    return sequelize.define('purchase', {
        id:{
            type : type.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        email: type.STRING,
        minionId:{
            type: type.INTEGER,
            allowNull: false,
            references:{
                model:'minion',
                key: 'id'
            }
        }
    });
}