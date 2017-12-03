const Discord = require('discord.js')
const CONFIG = require('./config.json')

// https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
const bot = new Discord.Client({disableEveryone : true});

bot.on('ready', async () => {
  console.log('Bot is ready. Username is ${bot.user.username}');
  try {
    let link = await bot.generateInvite(['ADMINISTRATOR']);
    console.log(link);
  } catch e {
    console.log(e.stack);
  }
});

bot.on('message', async message => {
  if(message.content == 'ping'){
    message.reply('pong');
    message.channel.sendMessage('pong');
  }
});

bot.login(CONFIG.botToken);
// console.log(CONFIG.botToken);
