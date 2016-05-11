const face = require('cat-ascii-faces');
const names = require('cat-names');

function cat() {
    return `${face()}`;
}

function catWithName() {
    return `${cat()} <-- ${names.random()}`;
}

export {
    cat,
    catWithName
}