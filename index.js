global.fetch = require('node-fetch');
const Discord = require('discord.js');
const cc = require('cryptocompare');
const { lookup } = require('./yahoo-stocks');
const CONFIG = require('./config.json');

const bot = new Discord.Client({disableEveryone : true});

bot.on('ready', async () => {
    console.log(`Bot is ready. Username is ${bot.user.username}`);
    try {
        let link = await bot.generateInvite(['ADMINISTRATOR']);
        console.log(link);
    } catch(e) {
        console.error(e);
    }
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(message.channel.name != 'crypto') return;
    if(!message.content.startsWith(CONFIG.prefix)) return;

    const coinList = await cc.coinList();
    const symbol = message.content.replace('$','').toUpperCase();
    const target = 'USD';
    const numExchanges = 3;

    if(Object.keys(coinList.Data).includes(symbol)) {
        console.log('crypto! ' + symbol);
        try {
            const topExchanges = (await cc.topExchanges(symbol, target, numExchanges))
                .map(item => item.exchange);

            const promises = topExchanges.map(async exchange => {
                const price = await cc.price(symbol, target, {exchanges: exchange});
                return `${exchange}: ${price[target]}`;
            })

            const result = (await Promise.all(promises)).join('\n')

            console.log(result);
            let richData = new Discord.RichEmbed()
                .setTitle(symbol)
                .setDescription(result)
                .setTimestamp();

            message.channel.send(richData);
        } catch(e) {
            message.channel.send(e);
        }


    } else {
        try {
            const stockquote = await lookup(symbol);
            console.log(stockquote);

            let richData = new Discord.RichEmbed()
                .setTitle(symbol)
                .setDescription(symbol + ': ' + stockquote.currentPrice);

            message.channel.send(richData);
        } catch(e){
            console.log(e);
        }
            // (data) => {
            //     console.log('test.js data comes thru!');
            //     console.log(data); // need to look at symbol and currentpx
            // },
            // (err) => {
            //     console.log('test.js err');
            //     console.log(err);
            // }
    }
});

bot.login(CONFIG.botToken);
