import {seed} from '../methbot';
import {config as cfg} from '../config';

const respond = seed(cfg.sources.shakespeare);

function greet(names: string[]): string {
    const greetings = {
        singular: [
            `Well be with you ${names[0]}!`,
            `Bless thee, ${names[0]}!`,
            `How do you, ${names[0]}`
        ],
        plural: [
            `Neighbours, God speed!`,
            `Good dawning to thee`,
            `God dig-you-den all!`
        ]
    }

    var si = Math.floor(Math.random() * greetings.singular.length);
    var pi = Math.floor(Math.random() * greetings.plural.length);
    return names.length > 1
        ? greetings.plural[pi]
        : greetings.singular[si];
}

export {
greet
}