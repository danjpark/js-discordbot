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
  if(message.channel.name != 'crypto') return;
  if(!message.content.startsWith(CONFIG.prefix)) return;

  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if(command === `${CONFIG.prefix}crypto`){

    try {
      const topExchanges = _.map(await cc.topExchanges(args[0], 'USD', (parseInt(args[1])||3)),
                           item => {return item.exchange;});

      let promArray = [];
      _.each(topExchanges, exchange => {
        promArray.push(cc.price(args[0],'USD',{exchanges:exchange}));
      });

      const topPrices = await Promise.all(promArray);

      const cleanResult = _.map(_.zip(topExchanges, topPrices), exchPrice => {
        return {exchange: exchPrice[0], price: exchPrice[1].USD};
      });

      let retString = _.reduce(cleanResult, function(memo, obj) {
        return memo + obj.exchange + ': `' + obj.price + '`\n';
      }, '');

      let richData = new Discord.RichEmbed()
        .setTitle(args[0])
        .setDescription(retString)
        .setTimestamp();

      message.channel.send(richData);
    } catch(e) {
      message.channel.send(e);
    }


  }
});

bot.login(CONFIG.botToken);
