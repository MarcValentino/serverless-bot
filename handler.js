'use strict';

const AWS = require('aws-sdk'); 


module.exports.handle = function(event, context, callback){
  const response = "Olá! Essa é a loja de minions!"

  callback(null, response);
};
  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

