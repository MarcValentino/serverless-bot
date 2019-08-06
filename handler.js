'use strict';
//const awsServerlessExpress = require('aws-serverless-express');
//const app = require('./app');
const express = require('express');
const serverless = require('serverless-http');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
//const bodyParser = require('body-parser');

const app = express();
//expressApp.use(bodyParser.json);
//expressApp.post('/handle', )
//module.exports.handle = serverless(expressApp)

function minionWelcome(agent) {
  agent.add(`Bem vindo à loja de minions!`);
}
   
function fallback(agent) {
  agent.add(`I didn't understand`);
  agent.add(`I'm sorry, can you try again?`);
}

app.get('/', function(req, res) {
  const agent = new WebhookClient({req, res});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

// Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('minionSaleStart', minionWelcome);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);
});

module.exports.handle = (event) => serverless(app); 
  //const app = express();

  

    /*const response = {

      statusCode: 200,
  
      body: JSON.stringify({ "response": "Succesful." }),
  
    };
    callback(null, response);
    */


 /* const response = {

    statusCode: 200,

    body: JSON.stringify({ "speech": "Hello World!" }),

  };*/

  

  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
