import fs = require('fs');
import markov = require('markov');
import S = require('string');

export class MarkovBot {
    private m: Markov;

    constructor(filename: string, order = 2) {
        const s = fs.createReadStream(filename);
        this.m = markov(order);
        this.m.seed(s);
    }

    public greet(names: string[]): string {
        return 'TILT';
    }

    public story(text: string, min: number): string {
        const res = this.m.respond(text, Math.random() * 50 + min)
            .map(x => S(x).trim().s.toLowerCase())
            .join(' ');

        return S(res).capitalize().s;
    }

    public respond(text: string): string {
        const res = this.m.respond(text)
            .map(x => S(x).trim().s.toLowerCase())
            .join(' ');

        return S(res).capitalize().s;
    }
}