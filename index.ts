/// <reference path="typings/main.d.ts" />

import net = require('net');
import _ = require('lodash');
import moment = require('moment');
import levelup = require('levelup');
import sublevel = require('level-sublevel');
import irc = require('slate-irc');

import {config as cfg} from './config';

const db = sublevel(levelup('./db', {
    valueEncoding: 'json'
}));

const people = db.sublevel('people');

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

var speak = require('speakeasy-nlp');
var greet = require('greetings');

var sentiment = {};

var counter = 0;

client.pass(cfg.password);
client.nick(cfg.nick);
client.user(cfg.nick, cfg.real);

client.join(cfg.channel);

client.names(cfg.channel, (err, names) => {
    console.log(JSON.stringify(names));
    switch (names.length) {
        case 1:
            return client.send(cfg.channel, `It's lonely in here...`);
        case 2:
            return client.send(cfg.channel, `${greet()}`);
        default:
            return client.send(cfg.channel, `${greet()} guys!`);
    }
});

client.on('message', e => {
    var r = speak.sentiment.analyze(e.message);
    sentiment[e.from] = sentiment[e.from] || 0;
    sentiment[e.from] += r.score;
    counter += 1;
    if (counter % 10 == 0) {
        client.send(cfg.channel, JSON.stringify(sentiment));
    }
});
