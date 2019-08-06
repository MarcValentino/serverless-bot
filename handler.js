'use strict';
//const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
//const express = require('express');
const serverless = require('serverless-http');
//const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
//const bodyParser = require('body-parser');
//const server = awsServerlessExpress.createServer(app);
//const app = express();
//expressApp.use(bodyParser.json);
//expressApp.post('/handle', )
//module.exports.handle = serverless(app);


module.exports.handler = serverless(app);

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
