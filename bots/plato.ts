import {MarkovBot} from '../methbot';
import {config as cfg} from '../config';

const bot = new MarkovBot(cfg.sources.plato);

function greet() {
    return bot.respond('bastard');
}

export {
bot,
greet
}