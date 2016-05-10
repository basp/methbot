/// <reference path="typings/main.d.ts" />

import net = require('net');
import fs = require('fs');
import _ = require('lodash');
import irc = require('slate-irc');

import {config as cfg} from './config';
import {seed} from './methbot';

import * as plato from './bots/plato';
import * as chat from './bots/chat';

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

const bots = {
    meth: {
        respond: chat.respond,
        greet: chat.greet
    },
    plato: {
        respond: plato.respond,
        greet: plato.greet
    }
}

var bot = bots.meth;

client.pass(cfg.password);
client.nick(cfg.nick);
client.user(cfg.nick, cfg.real);
client.join(cfg.channel);

client.names(cfg.channel, (err, people) => {
    var others = people
        .filter(x => x.name != cfg.nick)
        .map(x => x.name);
    
    console.log(others);
});

client.on('data', e => {
    console.log(e);
})

client.on('message', e => {
    const chance = 1.0;
    const r = Math.random();
    const doReply = r > - chance;
    if (doReply) {
        client.send(cfg.channel, bot.respond(e.message));
    }
});