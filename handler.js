'use strict';

const app = require('./app');
const serverless = require('serverless-http');
//var database = require('./database/database');
const aws = require('aws-sdk');

const dynamo = new aws.DynamoDB();

module.exports.handler = serverless(app);

module.exports.getAllMinions = () => {
  let params = {
    TableName: 'minions'
  }
  dynamo.scan(params, function(err, data){
    if(err) console.log("erro\n" + err.message );
    else console.log(data.Items);
  });
} 
/*module.exports.getAllMinions = async () => {
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

module.exports.getOneMinion = async (event) => {
    try {
      const { Minion } = await database();
      const minion = await Minion.findById(event.pathParameters.id)
      if (!minion) throw new HTTPError(404, `Minion com id: ${event.pathParameters.id} não encontrado.`)
      return {
        statusCode: 200,
        body: JSON.stringify(note)
      }
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: err.message || 'Houve um erro.'
      }
    }
  }

  module.exports.createPurchase = async (event) => {
    try {
        const { Purchase } = await database();
        const purchase = await Purchase.create(JSON.parse(event.body))
        return {
          statusCode: 200,
          body: JSON.stringify(purchase)
        }
      } catch (err) {
        return {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Compra não foi criada.'
        }
      }
  }

  module.exports.createMinion = async (event) => {
    try {
        const { Minion } = await database();
        const minion = await Minion.create(JSON.parse(event.body));
        return {
          statusCode: 200,
          body: JSON.stringify(minion)
        }
      } catch (err) {
        return {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Minion não foi criado.'
        }
      }
  }
*/