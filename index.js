const Discord = require('discord.js')
const CONFIG = require('./config.json')

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

  if(command === `${CONFIG.prefix}userinfo`){
    console.log(`print print print`);
  }

});

bot.login(CONFIG.botToken);
// console.log(CONFIG.botToken);

function getCyrptoPrice() {


  return
}
