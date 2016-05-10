/// <reference path="typings/main.d.ts" />

import net = require('net');
import fs = require('fs');
import _ = require('lodash');
import S = require('string');
import moment = require('moment');
import irc = require('slate-irc');
import greet = require('greetings');
import markov = require('markov');

import {config as cfg} from './config';

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

client.pass(cfg.password);
client.nick(cfg.nick);
client.user(cfg.nick, cfg.real);
client.join(cfg.channel);

client.names(cfg.channel, (err, names) => {
    switch (names.length) {
        case 2:
            return client.send(cfg.channel, `${greet()}`);
        default:
            return client.send(cfg.channel, `${greet()} guys!`);
    }
});

client.on('message', e => {
});