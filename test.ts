import {Markov} from './markov';

var markov = new Markov('c:/dev/chat.log');

var numberOfWords = Math.floor(Math.random() * 10);
console.log(markov.random('Aazeen', numberOfWords));