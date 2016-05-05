var irc = require('irc');

var client = new irc.Client('irc.freenode.net', 'Nanira-bot', {
    channels: ['##vanityguild']
});

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
});

client.addListener('error', function (message) {
    console.log('error: ', message);
});

client.join('##vanityguild Foo123', function () {
   client.say('##vanityguild', 'Good morning!'); 
});