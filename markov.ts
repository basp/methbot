import fs = require('fs');
import utils = require('./utils/sanitize');

var MarkovChain = require('markovchain');

export class Markov {
    private chain: any;
    
    constructor(path: string, encoding = 'utf-8') {
        this.chain = new MarkovChain(fs.readFileSync(path, encoding));
    }
    
    random(firstWord: string, numberOfWords = 5): string {
        return this.chain.start(firstWord).end(numberOfWords).process();
    }
    
    parse(s: string) {
        this.chain.parse(s);
    }
}