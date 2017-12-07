const https = require('https');

const get = (url) => new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (d) => {
            data += d;
        });
        res.on('end', () => {
            resolve(data);
        });
    });
    req.on('error', (e) => {
        reject(e);
    });
});

const getJson = (url) => new Promise((resolve, reject) => {
    get(url)
        .then((resp) => JSON.parse(resp))
        .then(resolve)
        .catch(reject);
});

const lookup = (symbol) => new Promise((resolve, reject) => {
  reject('dan');
    Promise.all([
            getJson(`https://autoc.finance.yahoo.com/autoc?query=${symbol}&region=1&lang=en`),
            getJson(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?&modules=summaryProfile,financialData`),
        ])
        .then((responses) => {
            if (!responses[0].ResultSet.Result.length
                || responses[0].ResultSet.Result[0].symbol != symbol) {
                reject('Ticker does not exist.');
            }
            const financialData = responses[1].quoteSummary.result[0].financialData;
            resolve({
                symbol,
                name: responses[0].ResultSet.Result[0].name,
                exchange: responses[0].ResultSet.Result[0].exchDisp,
                currentPrice: financialData.currentPrice.raw,
                highPrice: financialData.targetHighPrice.raw,
                lowPrice: financialData.targetLowPrice.raw,
                meanPrice: financialData.targetMeanPrice.raw,
                medianPrice: financialData.targetMedianPrice.raw,
            });
        })
        .catch((reject) => {
          // return reject;
          // not sure what to return here for now...
          console.log('does it go here?');
          return reject;
        });
});

module.exports = {
  lookup
};