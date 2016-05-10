import _ = require('lodash');

import {seed} from '../methbot';
import {config as cfg} from '../config';

const respond = seed(cfg.sources.plato);

function greet(names: string[]): string {
    return respond('bastard');
}

export {
respond,
greet
}