/// <reference path="typings/main.d.ts" />

import net = require('net');
import fs = require('fs');
import _ = require('lodash');
import irc = require('slate-irc');

import {config as cfg} from './config';

import * as bot from './bots/chat';

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

function shouldReply(): boolean {
    const chance = 0.95;
    const r = Math.random();
    return r > 1 - chance;
}

client.pass(cfg.password);
client.nick(cfg.nick);
client.user(cfg.nick, cfg.real);
client.join(cfg.channel);

client.names(cfg.channel, (err, people) => {
    var effort = Math.random() * cfg.slowness;
    var names = people
        .filter(x => x.name != cfg.nick)
        .map(x => x.name);

    console.log(names);

    setTimeout(() => {
        var greeting = bot.greet(names);
        client.send(cfg.channel, greeting);
    }, effort);
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

// client.on('join', e => {
//     var effort = Math.random() * cfg.slowness;
//     setTimeout(() => {
//         client.send(cfg.channel, bot.greet([e.nick]));
//     }, effort);
// });