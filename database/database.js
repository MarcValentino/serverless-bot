var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB();

//Tentativa de criar um acesso isolado ao BD

module.exports.getAllminions = function() {
    let params = {
      TableName: 'minions'
    }
    dynamo.scan(params, function(err, data){
      if(err) return [];
      return data.Items;
    });
}
