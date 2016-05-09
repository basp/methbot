import {Markov} from './markov';
import S = require('string');


var markov = new Markov('c:/dev/chat-sanitized.log');
var numberOfWords = Math.floor(Math.random() * 10) + 10;

var output = S(markov.random('Aazeen', numberOfWords));
console.log(output.capitalize().s);