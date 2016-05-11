import {seed} from './methbot';
import {config as cfg} from './config';
import {cat} from './random-cat';

// http://textfiles.com/stories/
// http://textfiles.com/stories/bulfelis.txt

const respond = seed(cfg.sources.cat);

function greet(names: string[]): string {
    return cat();
}

export {
greet,
respond
}