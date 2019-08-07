'use strict';

const express = require('express');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();
const router = express.Router();

var minionArray = {
  minions: [
    {
      num: 1,
      price: 10
    },
    {
      num: 2,
      price: 15
    },
    {
      num: 3,
      price: 20
    }
  ]
};

var chosenMinion = minionArray.minions[0];

var AWS = require('aws-sdk');

var ses = new AWS.SES({region: 'us-east-1'});

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
    agent.add('Você escolheu o minion ' + agent.parameters.num + '! Coloque seu email para confirmar a escolha!');
    //for(i=0;i<minionArray.minions.length;i++){
      //if(agent.parameters.num == minionArray.minions[i].num){
        //chosenMinion = minionArray.minions[i];
      //} 
    //}
  }

  function minionConfirm(agent){
    var params = {
      Destination: { 
        ToAddresses: [
          agent.parameters.email,
        ]
      },
      Message: { 
        Body: { /* required */
          Html: {
           Charset: "UTF-8",
           Data: ""
          },
          Text: {
           Charset: "UTF-8",
           Data: "Olá!\nEsse é o recibo da sua compra na loja de minions! Segue aqui a informação da compra:\n\nMinion comprado: Minion " + "1" + "\nPreço: " + "10,00" + "\n\nAgradecemos pela compra!" 
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Loja de Minions - Compra efetuada com sucesso!'
         }
        },
      Source: 'marcelovalentino99@gmail.com', /* required */
      
    };
    var sendPromise = ses.sendEmail(params).promise();
    sendPromise.then(
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
