var Q = require('q');
var _ = require('lodash');
var request = require('request');
var experience = require('./assets/experience.js');

module.exports = {
  getPoEStatus: getPoEStatus
};

/*
var options = {
  request: {},
  response: {},
  accounts: [],
  league: 'perandus', //TODO
  slackToken: '',
  webhookURL: '',
  customColor: '',
  customChannel: ''
}
 */

//Public factory function
function getPoEStatus (options) {

  var requestToken = options.request.param('token');
  var channel = options.request.param('channel_name');


  if(requestToken === options.slackToken){

    options.response.setHeader('Content-Type', 'text/html');
    options.response.send("Getting PoE Status...");

    var allPromises = [];

    _.forEach(options.accounts, function(account){
      allPromises.push(getPoEAccountInfo(account));
    });

    Q.all(allPromises).done(handleData);

    function handleData(accounts){
      var levelEXP = experience.xp;
      var fields = [];
      _.forEach(accounts, function(account){
        if(!_.isEmpty(account) && _.isObject(account)){
          var value = '';
          var accountName = '';

          var sortedChars = _.sortBy(account, function(char){
            return -char.level;
          });

          _.forEach(sortedChars, function(char){
            options.response.send(char);
            accountName = char.accountName;
            value += ' - ' + char.charName;

            if(char.level >= 50){
              var xp = Math.round((char.experience - levelEXP[char.level])/(levelEXP[parseInt(char.level, 10) + 1] - levelEXP[char.level])*100)/100;
              value += ' (' + (parseInt(char.level, 10) + xp) + ')';
            }else{
              value += ' (' + char.level + ')';
            }

            value += (char.online === '1' ? ' -- Online' : '') + '\n\n';
          });

          var person = {
            "title": accountName,
            "value": value,
            "short": false
          };

          fields.push(person);
        }
      });

      var message = {
        "channel": "#" + options.customChannel || channel,
        "fallback": "PoE Status",
        "color": options.customColor || "#AE2C1A",
        "fields": _.sortBy(fields, function(field){
          var match = field.value.match(/\(([^)]+)\)/);
          return -match[1];
        })
      };

      sendWebhookCall(message, options.webhookURL);
    }

  }else{
    options.response.setHeader('Content-Type', 'text/html');
    options.response.send("<h2>Error: Bad slack token in request.</h2>");
  }
}

//Private functions
function getPoEAccountInfo (accountName) {
  var deferred = Q.defer();

  //Get the ladder stats for this account
  request({
    url: 'http://api.exiletools.com/ladder?league=perandus&short=1&accountName='+accountName,
    method: 'GET',
    json: true
  }, function(error, resp, body){
    if(error){
      console.log(error);
      deferred.resolve(null);
    }else{
      console.log(resp.statusCode + " --- " + body);
      deferred.resolve(body);
    }
  });
  return deferred.promise;
}

function sendWebhookCall (message, url) {
  request({
    url: url,
    method: 'POST',
    form: {payload: JSON.stringify(message)}
  }, function(error, resp, body){
    if(error){
      console.log(error);
    }else{
      console.log(resp.statusCode + " --- " + body);
    }
  });
}