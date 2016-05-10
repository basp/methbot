/// <reference path="typings/main.d.ts" />

import net = require('net');
import fs = require('fs');
import _ = require('lodash');
import irc = require('slate-irc');

import {config as cfg} from './config';

import * as plato from './bots/plato';
import * as chat from './bots/chat';
import * as shakespeare from './bots/shakespeare';

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

const bots = {
    // chat: {
    //     greet: chat.greet,
    //     respond: chat.respond
    // },
    // plato: {
    //     greet: plato.greet,
    //     respond: plato.respond
    // },
    shakespeare: {
        greet: shakespeare.greet,
        respond: shakespeare.respond
    }
}

const keys = _.keys(bots);

function shouldReply(): boolean {
    const chance = 0.8;
    const r = Math.random();
    return r > 1 - chance;
}

var bot = bots.shakespeare;

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
    if (!shouldReply()) return;
    var effort = Math.random() * cfg.slowness;
    setTimeout(() => {
        client.send(cfg.channel, bot.respond(e.message));
    }, effort);
}); 