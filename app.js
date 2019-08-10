'use strict';

const express = require('express');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();
const router = express.Router();

var database = require('./database');
var sequelize = database.sequelize;

var AWS = require('aws-sdk');

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());



router.post('/', (request, response) => {
  

  const agent = new WebhookClient({request, response});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function minionWelcome(agent) {
    agent.add(`Bem vindo à loja de minions! Temos esses minions:\n\nMinion 1 - R$10,00\nMinion 2 - R$15,00\nMinion 3 - R$20,00\n\nQual vc quer?`);
  }
  
  
  function minionChoice(agent){
    if(agent.parameters.num > 3 || agent.parameters.num < 1) agent.end('Escolha inválida!'); 
    else agent.add('Você escolheu o minion ' + agent.parameters.num + '! Coloque seu email para confirmar a escolha!');
  }

  async function minionConfirm(agent) {

    let context = await agent.request_.body.queryResult.outputContexts[0].parameters;
    //console.log(user);
    let minions = {
      1: {"nome" : "Stuart", "preco" : 10 },
      2: {"nome": "Dave", "preco": 15},
      3: {"nome": "Pablo", "preco": 20}
    }
    AWS.config.update({
      accessKeyId: 'AKIATLDCCZSVEYBRKHHG',
      secretAccessKey: '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',
      region: 'us-east-1'
    });
    
    var ses = new AWS.SES({apiVersion: "2010-12-01"});
    
    var params = {
      Destination: { 
        ToAddresses: [
          agent.parameters.email,
        ]
      },
      Message: { 
        Body: { /* required */
          /*Html: {
           Charset: "UTF-8",
           Data: `<p>Obrigado pela compra na loja de minions! Os dados da sua compra estão aqui:</p><p id="output"></p><script></script> <p>Volte sempre!</p>`
          },*/
          Text: {
           Charset: "UTF-8",
           Data: "Obrigado pela compra na loja de minions! Aqui está o seu recibo: \n\nNúmero: "+ context.num+ "\nNome: "+minions[context.num].nome+"\nPreço: R$"+minions[context.num].preco +",00 \n\nVolte sempre!" 
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Loja de Minions - Compra efetuada com sucesso!'
         }
        },
      Source: "marcelovalentino99@gmail.com", /* required */
      
    };
    var sendPromise = ses.sendEmail(params).promise();
    await sendPromise.then(
      function(data){
        console.log(data);
        agent.add('Email enviado para ' + agent.parameters.email + '! Verifique seu email pelo comprovante.');
      }).catch(
      function(err){
        console.error(err, err.stack);
        agent.add('Falha no envio do email! Verifique se o mesmo está correto.')
      }
    );
    
  }

  function fallback(agent) {
    agent.add(`Não entendi o que você falou. Pode tentar de novo?`);
  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('minionSaleStart', minionWelcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('minionSaleChoice', minionChoice);
  intentMap.set('minionSaleConfirm', minionConfirm);
  agent.handleRequest(intentMap);
});

app.use('/', router);

module.exports = app;
