const { lookup } = require('./yahoo-stocks');

dan = lookup('AAA').then(
    (data) => {
        console.log('test.js data comes thru!');
        console.log(data); // need to look at symbol and currentpx
    },
    (err) => {
        console.log('test.js err');
        console.log(err);
    }
)
