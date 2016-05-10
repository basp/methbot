import greetings = require('greetings');

import {seed, BotMode, BotModeConfig} from '../methbot';
import {config as cfg} from '../config';

const respond = seed(cfg.sources.chat);

function greet(names: string[]): string {
    switch (names.length) {
        case 1: return `${greetings()}`;
        default: return `${greetings()} guys!`;
    }
}

export {
respond,
greet
}