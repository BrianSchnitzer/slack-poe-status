# slack-poe-status

> Simple PoE API abstraction for sending account statuses into a Slack client

A quick node package to post a list of the current statuses of multiple Path of Exile accounts.

## Getting Started

```shell
npm install slack-poe-status --save
```

Once the plugin has been installed, it may be enabled inside your Node servier with this line of JavaScript:

```js
var slackPoEStatus = require('slack-poe-status');
```

## The getPoEStatus function

### Overview
You'll need to pass the function an options object, like so

```js
slackPoEStatus.getPoEStatus({...});
```

### Options

#### request
Type: `Object`
REQUIRED

The request object given by express.

#### response
Type: `Object`
REQUIRED

The response object given by express.

#### accounts
Type: `[]`
Default value: `[]`

An array of account name strings to get statuses for.

#### league
Type: `String`
REQUIRED

The Path of Exile league you would like account statuses for.  At the time of this module's creation, the league was 'perandus'.

#### slackToken
Type: `String`
REQUIRED

The webhook token given by your Slack integration manager for this integration.

#### webhookURL
Type: `String`
REQUIRED

The incoming webhook URL given by your Slack integration manager for this integration.

#### customColor
Type: `String - Hex color value`
Default value: `#AE2C1A`

The color of the bar shown to the left of the list in the Slack client.

#### customChannel
Type: `String`
Default value: Channel from which the call to the integration was made.

This allows for the overriding of the channel in which the list is displayed.  If not given, the response will be sent to the channel
in which the call originated.

### Usage Examples

#### Only required options

In this example, only the required options are passed, and the status check will report the status for the three given accounts.

```js
var slackPoEStatus = require('slack-poe-status');

var accounts = ['ChrisGGG', 'MorsDidItFirst', 'Krillson'];
var options = {
  request: req,
  response: res,
  accounts: accounts,
  league: 'perandus',
  slackToken: 'LongStringOfNumbersAndLetters1234567890',
  webhookURL: 'https://hooks.slack.com/services/AnotherLongString/Path/Thing1234'
};

slackPoEStatus.getPoEStatus(options);
```