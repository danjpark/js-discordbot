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
    cc.price(args[0], 'USD')
    .then(prices => {
      message.channel.send(prices.USD);
    })
    .catch(reason => {
      message.channel.send(reason);
      console.log(reason);
    })
  }
});

bot.login(CONFIG.botToken);
// console.log(CONFIG.botToken);

function getCyrptoPrice() {


  return
}
