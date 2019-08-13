'use strict';

const express = require('express');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();
const router = express.Router();

var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIATLDCCZSVEYBRKHHG',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const dynamo = new AWS.DynamoDB();


router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());



router.post('/', (request, response) => {
  
  var agent = new WebhookClient({request, response});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  async function minionWelcome(agent) {
    
    
    let params = {
      TableName: 'minions'
    }
    let scan = dynamo.scan(params).promise(); 
    await scan.then(
      function(data){
        console.log("Vaaai\n");
        
        let stringResponse = "";
        for(let i = 0;i<data.Items.length;i++){
          stringResponse += "Num: " + data.Items[i].id.N + "\nNome: " + data.Items[i].name.S + "\nPreço: " + data.Items[i].price.N + "\n\n";
          
        }
        agent.add("Bem vindo à loja de minions! Temos esses minions:\n\n" + stringResponse + "\nQual você quer?");
        console.log("sucesso!\n" + stringResponse);
      }
    ).catch(
      function(err){
        agent.add("Erro no BD!");
        console.log("Erro!\n" + err);
      }
    );
  }
  
  
  async function minionChoice(agent){
    let params = {
      Key:{
        id : {N: "" +agent.parameters.num}
      },
      TableName: 'minions'
    }
    let get = dynamo.getItem(params).promise(); 
    await get.then(
      function(data){
        agent.add("Você escolheu o minion n° " + data.Item.id.N + ", o " + data.Item.name.S + "! Coloque o seu email para confirmar a compra!");
      }
    ).catch(
      function(err){
        console.log("erro:\n"+err);
        agent.end("Escolha inválida! Escolha um número dentro das opções!");
      }
    );
  }

  async function minionConfirm(agent) {
    
    var userChoice = await agent.request_.body.queryResult.outputContexts[0].parameters;
    let paramsMinion = {
      Key:{
        id : {N: "" + userChoice.num }
      },
      TableName: 'minions'
    }
    var ses = new AWS.SES({apiVersion: "2010-12-01"});

    let get = dynamo.getItem(paramsMinion).promise(); 
    await get.then(
      async function(data){
        var emailParams = {
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
               Data: "Obrigado pela compra na loja de minions! Aqui está o seu recibo: \n\nNúmero: "+ userChoice.num+ "\nNome: "+data.Item.name.S+"\nPreço: R$"+data.Item.price.N +",00 \n\nVolte sempre!" 
              }
             },
             Subject: {
              Charset: 'UTF-8',
              Data: 'Loja de Minions - Compra efetuada com sucesso!'
             }
            },
          Source: "marcelovalentino99@gmail.com", 
          
        };
        var sendPromise = ses.sendEmail(emailParams).promise();
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
    ).catch(
      function(err){
        console.log("erro:\n"+err);
        agent.end("Erro no BD!");
      }
    );
  }

  function fallback(agent) {
    agent.add(`Não entendi o que você falou. Pode tentar de novo?`);
  }

  let intentMap = new Map();
  intentMap.set('minionSaleStart', minionWelcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('minionSaleChoice', minionChoice);
  intentMap.set('minionSaleConfirm', minionConfirm);
  agent.handleRequest(intentMap);
});

app.use('/', router);


module.exports = app;
