const Discord = require('discord.js')
const bot = new Discord.Client();
const CONFIG = require('./config.json')

bot.on('message', (message) => {
  if(message.content == 'ping'){
    message.reply('pong');
    message.channel.sendMessage('pong');
  }
});

bot.login(CONFIG.botToken);
// console.log(CONFIG.botToken);
