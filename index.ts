/// <reference path="typings/main.d.ts" />

import moment = require('moment');
import levelup = require('levelup');
import sublevel = require('level-sublevel');
import irc = require('irc');

import {NICK, PWD, CHANNEL} from './config';

var greet = require('greetings');

const db = sublevel(levelup('./methbot.db', {
    valueEncoding: 'json'
}));

const people = db.sublevel('people');

const client = new irc.Client('irc.freenode.net', NICK, {
    channels: [CHANNEL]
});

client.on('pm', (from, text) => {
    console.log(text);
});

client.on('message', (from, to, msg) => {
    console.log(`${from} => ${to}: ${msg}`);
});

client.on('names', (channel, nicks) => {
    console.log(nicks);
});

client.on('join', (channel, nick, msg) => {
    var val = {
       lastSeen: moment().toISOString(),
       raw: msg 
    };
    
    people.put(nick, val, (err) => {
        if (err) console.error(err);
    });
});

client.on('error', (msg) => {
    console.error(msg);
});

client.join(`${CHANNEL} ${PWD}`, () => {
    var msg = greet();
    client.say(CHANNEL, msg);
});