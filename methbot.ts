import fs = require('fs');
import S = require('string');
import markov = require('markov');

interface SeedCallback {
    (): void;
}

interface RespondFunc {
    (text: string): string;
}

interface GreetFunc {
    (names: string[]): string;
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
    SeedCallback,
    RespondFunc,
    GreetFunc,
    respond,
    seed
}