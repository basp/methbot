import fs = require('fs');
import S = require('string');
import _ = require('lodash');

var markov = require('markov');

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

interface BotMode {
    greet(names: string[]): string;
    respond(text: string): string;
}

interface BotModeConfig {
    key: string;
    source: string;
}

const m = markov();

function seed(filename: string, callback?: SeedCallback): RespondFunc {
    const s = fs.createReadStream(filename);
    m.seed(s, callback);
    return respond;
}

function respond(text: string): string {
    const res = m.respond(text)
        .map(x => S(x).trim().s.toLowerCase())
        .join(' ');

    return S(res).capitalize().s;
}

export {
BotMode,
BotModeConfig,
respond,
seed
}