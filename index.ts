/// <reference path="typings/main.d.ts" />

import net = require('net');
import fs = require('fs');
import _ = require('lodash');
import irc = require('slate-irc');
import S = require('string');
import moment = require('moment');
import {cat, catWithName} from './random-cat';
import {config as cfg} from './config';
import * as bot from './bots/chat';
import * as catBot from './cat-stories';

// TODO: Allow for parsing cat names from request
// TODO: Include nick in response if especially slow
// TODO: Remember spawned cats (and stories for consistencie)
// TODO: Allow people to ask about spawned cats 

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);
const started = moment();

client.pass(cfg.password);
client.nick(cfg.nick);
client.user(cfg.nick, cfg.real);
client.join(cfg.channel);

client.names(cfg.channel, (err, people) => {
    var effort = Math.random() * cfg.slowness + cfg.lag;
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
    // TODO: Make this configurable (seems like DEBUG)
    console.log(e);
})

const pendingReplies = {};
const chanceOfCat = 0.02;

function shouldReply(nick: string, text: string): boolean {
    // HACK: Make this configurable (with aliases in cfg)
    // Return stuff when asked a question
    if (lastOneWhoSpoke && S(text).trim().endsWith('?')) {
        return true;
    }

    // Return on name alias    
    if (S(text.toLowerCase()).contains('meth')) {
        return true;
    }
    if (S(text.toLowerCase()).contains('methbot')) {
        return true;
    }

    var chance = 0.08;
    if (pendingReplies[nick]) {
        chance = 0.001;
    }

    const r = Math.random();
    return r > (1 - chance);
}

var lastOneWhoSpoke = false;

// TODO: This whole thing is getting out of control
client.on('message', e => {
    const effort = Math.random() * cfg.slowness + cfg.lag;

    // HACK: This code path totally doesn't belong here
    // TODO: These are basically commands, implement them as such
    if (S(e.message.toLowerCase()).contains('cat')) {
        setTimeout(() => {
            const portrait = catWithName();
            const description = catBot.bot.respond(e.message);
            client.send(cfg.channel, `${portrait}, description: ${description}`);
        }, effort);
        return;
    }

    if (S(e.message.toLowerCase()).contains('cats')) {
        setTimeout(() => {
            client.send(cfg.channel, catBot.bot.respond(e.message));
        }, effort);
        return;
    }

    if (!shouldReply(e.from, e.message)) return;

    const doCat = Math.random() > (1 - chanceOfCat);
    if (doCat) {
        setTimeout(() => {
            client.send(cfg.channel, cat());
        }, effort);
        return;
    }

    pendingReplies[e.from] = true;
    setTimeout(() => {
        client.send(cfg.channel, bot.respond(e.message));
        lastOneWhoSpoke = true;
        pendingReplies[e.from] = false;
    }, effort);
});

client.on('join', e => {
    if (e.nick == cfg.nick) {
        return;
    }

    var effort = Math.random() * cfg.slowness;
    setTimeout(() => {
        client.send(cfg.channel, bot.greet([e.nick]));
    }, effort);
});

const SPAWN_DELAY = 5; // minites 
const humanizeDuration = require('humanize-duration');
const cats = {};

setInterval(() => {
    const chance = 1.0;
    const doCat = Math.random() > (1 - chance);
    if (doCat) {
        var ms = moment().diff(started);
        var dur = humanizeDuration(ms);
        client.send(cfg.channel, `${catWithName()} (${dur})`);
    }
}, SPAWN_DELAY * 60 * 1000);