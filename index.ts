/// <reference path="typings/main.d.ts" />

import moment = require('moment');
import levelup = require('levelup');
import sublevel = require('level-sublevel');
import irc = require('irc');
import _ = require('lodash');

import {NICK, PWD, CHANNEL} from './config';
import {trivia} from './random-number-facts';

const greet = require('greetings');
const speak = require('speakeasy-nlp');

const db = sublevel(levelup('./methbot.db', {
    valueEncoding: 'json'
}));

const history = db.sublevel('history');

const people = db.sublevel('people');

const client = new irc.Client('irc.freenode.net', NICK, {
    channels: [CHANNEL]
});

client.on('pm', (from, text) => {
    // var c = speak.classify(text);
    trivia('random', s => client.say(CHANNEL, s));
});

client.on('message', (from, to, msg) => {
    console.log(speak.classify(msg));
});

client.on('names', (channel, nicks) => {
    var now = moment().toISOString();
    var batch = _.keys(nicks).map(x => {
        return {
            key: x,
            value: now,
            type: 'put'
        };
    });

    people.batch(batch, (err) => {
        if (err) console.error(err);
    });
});

client.on('join', (channel, nick, msg) => {
    var now = moment().toISOString();
    people.put(nick, now, (err) => {
        if (err) console.error(err);
    });
});

client.on('error', (msg) => {
    console.error(msg);
});

client.join(`${CHANNEL} ${PWD}`, () => {
    client.say(CHANNEL, greet());
});