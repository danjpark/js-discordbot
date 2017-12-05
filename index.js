global.fetch = require('node-fetch');
const Discord = require('discord.js');
const cc = require('cryptocompare');
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

  const [
    command,
    coin = 'BTC',
    target = 'USD',
    numExchanges = 3
  ] = message.content.split(' ');

  console.log(command, coin, target, numExchanges);

  if(command === `${CONFIG.prefix}crypto`){

    try {
      const topExchanges = (await cc.topExchanges(coin, target, numExchanges))
                .map(item => item.exchange);

      const promises = topExchanges.map(async exchange => {
        const price = await cc.price(coin, target, {exchanges: exchange});
        return `${exchange}: ${price[target]}`;
      })

      const result = (await Promise.all(promises)).join('\n')

      console.log(result);
      let richData = new Discord.RichEmbed()
        .setTitle(coin)
        .setDescription(result)
        .setTimestamp();

      message.channel.send(richData);
    } catch(e) {
      message.channel.send(e);
    }


  }
});

bot.login(CONFIG.botToken);
