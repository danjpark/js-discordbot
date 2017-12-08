global.fetch = require('node-fetch');
const cc = require('cryptocompare');

let dan = cc.coinList()
    .then(
        result => {
            console.log(result);
            console.log(Object.keys(result.Data));
        },
        error => {
            console.log(error);
        }
    );
