import fs = require('fs');
import S = require('string');
import _ = require('lodash');
import markov = require('markov');

interface SeedCallback {
    (): void;
}

interface ModeCallback {
    (mode: BotMode): void;
}

interface RespondFunc {
    (text: string): string;
}

interface GreetFunc {
    (names: string[]): string;
}

// Rename to Bot?
interface BotMode {
    greet(names: string[]): string;
    respond(text: string): string;
}

interface BotModeConfig {
    key: string;
    source: string;
}

// DEPRECATED
const m = markov();

// Or implement BotMode?
class MarkovBot {
    private m: Markov;

    constructor(filename: string, order = 2) {
        this.m = markov(order);
        this.m.seed(filename);
    }

    public respond(text: string) {
        const res = this.m.respond(text)
            .map(x => S(x).trim().s.toLowerCase())
            .join(' ');

        return S(res).capitalize().s;
    }
}

export {
BotMode,
BotModeConfig,
MarkovBot
}