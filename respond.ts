import fs = require('fs');
import markov = require('markov');
import S = require('string');

const m = markov();
const s = fs.createReadStream('c:/dev/chat-sanitized.log');

function respond(text: string): string {
    var res = m.respond(text)
        .map(x => S(x).trim().s.toLowerCase())
        .join(' ');

    return S(res).capitalize().s;
}

export {
respond
}