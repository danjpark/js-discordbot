global.fetch = require('node-fetch');
const cc = require('cryptocompare');


cc.price('BTC', ['USD', 'EUR'])
.then(prices => {
  console.log(prices)
  // -> { USD: 1100.24, EUR: 1039.63 }
})
.catch(console.error)
