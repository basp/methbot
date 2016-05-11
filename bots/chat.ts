import greetings = require('greetings');

import {seed, BotMode, BotModeConfig} from '../methbot';
import {config as cfg} from '../config';

const respond = seed(cfg.sources.chat);

function greet(names: string[]): string {
    console.log(names);
    switch (names.length) {
        case 1: return `${greetings()} ${names[0]}!`;
        default: return `${greetings()} guys!`;
    }
}

export {
respond,
greet
}