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
import {trivia} from './random-number-facts';

// TODO: Spawn a cat for a specific person
// TODO: Allow for parsing cat names from request
// TODO: Include nick in response if especially slow
// TODO: Remember spawned cats (and stories for consistencie)
// TODO: Allow people to ask about spawned cats 
// TODO: Allow for a slight chance of bot not replying to nick 

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
    if (S(text).trim().endsWith('?')) {
        return true;
    }

    // Return stuff when asked a question
    if (S(text).trim().endsWith('!')) {
        return true;
    }

    if (S(text.toLowerCase()).contains('meth')) {
        return true;
    }

    if (S(text.toLowerCase()).contains('methbot')) {
        return true;
    }

    if (S(text.toLowerCase()).contains('bot')) {
        return true;
    }

    var chance = 0.06;

    // Should reply more often when only 1 message in between

    if (pendingReplies[nick]) {
        chance = 0.001;
    }

    const r = Math.random();
    return r > (1 - chance);
}

const alternativeRefs = [
    'dear',
    'sweety',
    'silly',
    'you silly'
];

function randomlyReplaceSelfRef(x: string): string {
    if (x.length < 4) {
        return x;
    }

    if (x.toLowerCase() == cfg.nick.substr(0, x.length).toLowerCase()) {
        var r = Math.random();
        var chance = 0.95;
        if (r > (1 - chance)) {
            var i = Math.floor(Math.random() * alternativeRefs.length);
            return alternativeRefs[i];
        }
    }

    return x;
}

// TODO: This whole thing is getting out of control
client.on('message', e => {
    const effort = Math.random() * cfg.slowness + cfg.lag;

    if (S(e.message.toLowerCase()).contains(' number fact')) {
        setTimeout(() => {
            trivia(Math.random() * 100000, s => {
                client.send(cfg.channel, `${s}`);
            });
        }, effort);
        return;
    }

    // HACK: This code path totally doesn't belong here
    // TODO: These are basically commands, implement them as such
    if (S(e.message.toLowerCase()).contains(' cat ')) {
        setTimeout(() => {
            const portrait = catWithName();
            const description = catBot.bot.respond(e.message);
            client.send(cfg.channel, `${portrait} "${description}"`);
        }, effort);
        return;
    }

    if (S(e.message.toLowerCase()).contains(' cats ')) {
        var r = Math.random();
        setTimeout(() => {
            client.send(cfg.channel, catBot.bot.respond(e.message));
        }, effort);
        return;
    }

    if (S(e.message.toLowerCase()).contains(' story ')) {
        console.log('Asked for a story');
        setTimeout(function () {
            client.send(cfg.channel, catBot.bot.story(e.message, 500));
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
        var raw = bot.respond(e.message);
        var res = raw.split(' ')
            .map(x => randomlyReplaceSelfRef(x))
            .join(' ');

        client.send(cfg.channel, res);
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

const SPAWN_DELAY = 15; // minutes 
const humanizeDuration = require('humanize-duration');
const cats = {};

setInterval(() => {
    const chance = 1.0;
    const doCat = Math.random() > (1 - chance);
    if (doCat) {
        var ms = moment().diff(started);
        var dur = humanizeDuration(ms);
        var r = Math.random();
        if (r > 0.9) {
            client.names(cfg.channel, (err, people) => {
                if (err) return console.error(err);
                var names = people
                    .filter(x => x.name != cfg.nick)
                    .map(x => x.name);

                var i;

                i = Math.floor(Math.random() * names.length);
                var nick = names[i];

                var actions = [
                    'hugs',
                    'smiles at',
                    'blows a kiss at',
                    'giggles at',
                    'flirts with',
                    'winks at',
                    'pokes',
                    'sneaks up to',
                    'dances around'
                ];

                i = Math.floor(Math.random() * actions.length);
                var action = actions[i];

                var msg = `${action} ${nick}`;
                console.log(msg);
                // client.send(cfg.channel, bot.respond(names[i]));
                client.action(cfg.channel, msg);

            });
            return;
        }

        if (r > 0.8) {
            var fact = trivia(Math.random() * 100000, s => {
                client.send(cfg.channel, s);
            });
            return;
        }

        if (r > 0.7) {
            client.send(cfg.channel, `${catWithName()}`);
            return;
        }

        if (r > 0.6) {
            client.send(cfg.channel, bot.respond('the'));
        }
    }
}, SPAWN_DELAY * 60 * 1000);