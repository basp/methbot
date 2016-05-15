import http = require('http');

function trivia(number: string | number, callback: (s: string) => void) {
    const opts = {
        hostname: 'numbersapi.com',
        path: `/random/trivia`
    };

    var buf = '';
    http.get(opts, res => {
        res.on('data', d => {
            buf += d;
        });

        res.on('end', () => {
            callback(buf);
        });
    });
}

export {
trivia
}