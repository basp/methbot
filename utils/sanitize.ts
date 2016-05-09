import fs = require('fs');
import S = require('string');

export = (path) => {
    fs.readFile(path, (err, data) => {
        var sanitized = S(data)
            .lines().map(x => S(x).stripTags('Melthiela', 'Aazeen'))
            .join(' ');

        return sanitized;
    });
}