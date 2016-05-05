/// <reference path="typings/main.d.ts" />

import levelup = require('levelup');

const db = levelup('./db', {
    valueEncoding: 'json'
});

db.put('foo', 'bar', (err) => {
   if (err) return console.error(err);
   db.get('foo', (err, val) => {
      if (err) return console.error(err);
      console.log(val); 
   });
});