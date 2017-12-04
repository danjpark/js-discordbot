global.fetch = require('node-fetch');
const Discord = require('discord.js');
const cc = require('cryptocompare');
const _ = require('underscore');
const CONFIG = require('./config.json');

// https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
const bot = new Discord.Client({disableEveryone : true});

bot.on('ready', async () => {
  console.log(`Bot is ready. Username is ${bot.user.username}`);
  try {
    let link = await bot.generateInvite(['ADMINISTRATOR']);
    console.log(link);
  } catch(e) {
    console.log(e.stack);
  }
});

bot.on('message', async message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  if(!message.content.startsWith(CONFIG.prefix)) return;

  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if(command === `${CONFIG.prefix}crypto`){

    const topExchanges = _.map(await cc.topExchanges(args[0], 'USD', 4),
                         item => {return item.exchange;});

    let promArray = [];
    _.each(topExchanges, exchange => {
      promArray.push(cc.price(args[0],'USD',{exchanges:exchange}));
    });

    const topPrices = await Promise.all(promArray);

    const cleanResult = _.map(_.zip(topExchanges, topPrices), exchPrice => {
      // return(exchPrice[0] + " : " + exchPrice[1].USD.toFixed(2).toString());
      return {exchange: exchPrice[0], price: exchPrice[1].USD};
    });


    //_.zip(topExchanges, topPrices)

    // [ [ 'Coinbase', { USD: 11395 } ],
    // [ 'Bitfinex', { USD: 11280 } ],
    // [ 'Bitstamp', { USD: 11337.36 } ],
    // [ 'Gemini', { USD: 11402.08 } ] ]


    
    // let richData = new Discord.RichEmbed()
    //   .setTitle(args[0])
    //   .setDescription(exchanges[0].exchange)
    //   .setTimestamp();
    //
    // message.channel.sendEmbed(richData);


  }
});

bot.login(CONFIG.botToken);

// TO DO:
// figure out how to explicitally call exchange in cc.prices
// use underscore to do it for each in list
// figure out how to pass in default param (if nothing just pass in 2 for test and then 1)
