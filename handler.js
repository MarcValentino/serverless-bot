'use strict';

const app = require('./app');
const serverless = require('serverless-http');
//var database = require('./database/database');
//const aws = require('aws-sdk');

//const dynamo = new aws.DynamoDB();

module.exports.handler = serverless(app);


module.exports.getAllMinions = async () => { //Esse lambda funcionou avulso e pegou a lista de minions do bd.
    try{
        const { Minion } = await database();
        const allMinions = Minion.findAll();
        return {
            statuscode: 200,
            body: JSON.stringify(allMinions)
        }
    }catch(err){
        return{
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Minions não encontrados.'
        }
    }
}
