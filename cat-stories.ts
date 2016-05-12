import {MarkovBot} from './markov-bot';
import {config as cfg} from './config';
import {cat} from './random-cat';

// http://textfiles.com/stories/
// http://textfiles.com/stories/bulfelis.txt

const bot = new MarkovBot(cfg.sources.cat, 3);

function greet(names: string[]): string {
    return cat();
}

export {
bot,
greet
}