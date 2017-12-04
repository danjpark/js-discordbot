global.fetch = require('node-fetch');
const Discord = require('discord.js');
const cc = require('cryptocompare');
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
  console.log('starting')

  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  if(!message.content.startsWith(CONFIG.prefix)) return;

  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if(command === `${CONFIG.prefix}crypto`){

    cc.topExchanges(args[0], 'USD', 3)
    .then(prices => {
      let richData = new Discord.RichEmbed()
        .setTitle(args[0])
        .setDescription(prices)
        .setTimestamp();

      message.channel.sendEmbed(richData);
    })
    .catch(reason => {
      message.channel.send(reason);
      console.log(reason);
    })
  }
});

bot.login(CONFIG.botToken);

// TO DO:
// figure out how to explicitally call exchange in cc.prices
// use underscore to do it for each in list
// figure out how to pass in default param (if nothing just pass in 2 for test and then 1)
