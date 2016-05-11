import greetings = require('greetings');

import {MarkovBot, BotMode, BotModeConfig} from '../methbot';
import {config as cfg} from '../config';

const bot = new MarkovBot(cfg.sources.chat);

function greet(names: string[]): string {
    console.log(names);
    switch (names.length) {
        case 1: return `${greetings()} ${names[0]}!`;
        default: return `${greetings()} guys!`;
    }
}

export {
bot,
greet
}