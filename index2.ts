/// <reference path="typings/main.d.ts" />

import fs = require('fs');
import net = require('net');
import irc = require('slate-irc');
import moment = require('moment');
import S = require('string');
import _ = require('lodash');

// TODO: Spawn a cat for a specific person
// TODO: Stories
// TODO: Include nick in response if especially slow
// TODO: More interesting reply intervals (dynamic `slowness`)
// TODO: Allow for parsing cat names from request
// TODO: Remember spawned cats (and stories for consistencie)
// TODO: Allow people to ask about spawned cats 
// TODO: Allow for a slight chance of bot not replying to nick 
// TODO: Proper logging
// TODO: Persistence
// TODO: Randomly "forget" to sanitize <nick> from chat input

interface Config {
    nick: string;
    user: string;
    password: string;
    channel: string;
}

interface Response {
    send(msg: string): Response;
    done(finished?: boolean): void;
}

class BaseResponse implements Response {
    private finished = false;

    send(msg: string): Response {
        return this;
    }

    public done(finished: boolean = true): boolean {
        this.finished = this.finished && finished;
        return this.finished;
    }
}

interface Middleware {
    (res: Response): Response;
}

function greet(res: Response) {
    res.send('Hello! K Bye thanks!');
    res.done();
}

class Bot {
    private client: irc.Client;
    private middleware: Middleware[];

    constructor(socket: net.Socket) {
        this.client = irc(socket);
        this.middleware = [];
    }

    public use(m: Middleware) {
        this.middleware.push(m);
    }

    public connect(cfg: Config) {
        client.pass(cfg.password);
        client.nick(cfg.nick);
        client.user(cfg.nick, cfg.user);
        client.join(cfg.channel);
    }

    public run() {
        for (var i = 0; i < this.middleware.length; i++) {
            this.middleware[i]
        }
    }
}

const stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

const client = irc(stream);

client.on('data', e => {
    console.log(e);
});