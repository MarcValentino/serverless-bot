'use strict';

const express = require('express');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
const router = express.Router();

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
    agent.add(`Bem vindo à loja de minions! Temos esses minions:\nMinion 1\nMinion 2\nMinion 3\n\nQual vc quer?`);
  }
  
  function minionChoice(agent){
    agent.add('Você escolheu o minion ' + agent.parameters.num + '! Coloque seu email para confirmar a escolha!');
  }

  function minionConfirm(agent){
    agent.add('Email enviado para ' + agent.parameters.email + '! Verifique seu email pelo comprovante.');
  }

  function fallback(agent) {
    agent.add(`Não entendi o que você falou. Pode repetir?`);
    agent.add(`Tenta de novo, não peguei.`);
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
