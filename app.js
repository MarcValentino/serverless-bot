'use strict';
const express = require('express');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
//const bodyParser = require('body-parser');
//const cors = require('cors');
//const compression = require('compression');
//const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();


app.get('/', (req, res) => talkToMe(req, res));



function talkToMe(request, response){
  const agent = new WebhookClient({request, response});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('minionSaleStart', minionWelcome);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);
}

function minionWelcome(agent) {
  agent.add(`Bem vindo à loja de minions!`);
}
   
function fallback(agent) {
  agent.add(`I didn't understand`);
  agent.add(`I'm sorry, can you try again?`);
}