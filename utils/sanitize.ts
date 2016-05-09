import fs = require('fs');
import S = require('string');


fs.readFile('c:/dev/chat.log', (err, data) => {
    var sanitized = S(data)
        .lines().map(x => S(x).stripTags('Melthiela', 'Aazeen'))
        .join(' ');
        
    fs.writeFileSync('c:/dev/chat-sanitized.log', sanitized);
});
