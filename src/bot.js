require('dotenv').config();

const google = require('google');
const { Client } = require('discord.js');
const client = new Client({
  partials: ['MESSAGE','REACTION']
});
const axios = require('axios');

const PREFIX = "$";
  
client.on('ready',()=>{
  console.log(`${client.user.tag} has logged in`);
});

client.on('message',async(message)=>{
  if(message.author.bot) return;
  if(message.content.startsWith(PREFIX)){
    const [CMD_NAME,...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    
    if(CMD_NAME === 'kick'){
      if(!message.member.hasPermission('KICK_MEMBERS'))
      return message.reply('You do not have permissions ');
     if(args.length === 0) return message.reply("Please provide ID"); 
     const member = message.guild.members.cache.get(args[0]);
     if(member){
       member
       .kick()
       .then((member) => message.channel.send(`${member} was kicked`))
       .catch((err) => message.channel.send('I cannot kick that user :(( as its beyond my paycheck'));
     } else {
       message.channel.send("Member not found");
     }
    }else if(CMD_NAME === 'ban'){
      if(!message.member.hasPermission('BAN_MEMBERS'))
      return message.reply('You do not have ban permissions');
      if(args.length === 0) return message.reply("Please provide ID");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send(`${user} banned`);
        console.log(user); 
      }catch(err){
          message.channel.send('Some error occured');
         console.log(err);
      }
    }
    
  }

  if(message.attachments){
    var url = message.attachments.array()[0].url;
  
    var apiUrl = 'https://api.ocr.space/parse/imageurl?apikey=c44024397388957&url=' + url;
    var text = '';
    await axios.get(apiUrl)
    .then(async(response) =>{
      text = response.data['ParsedResults'][0]['ParsedText'];
    });

   await google(text, (err, res) => {
      if (err) console.error(err);
      text = text + '\n Search .....\n' + res.url; 
      message.channel.send(text);
    });
  }
});

client.on('messageReactionAdd', (reaction,user) => {

  const {name} = reaction.emoji; 
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === '775294723996516352'){
    switch (name){
      case '🍿':
        member.roles.add('775281264201695282');
        break;
      case '🍎':
        member.roles.add('775281340547072011');
        break;
      case '🍊':
        member.roles.add('775281128817950750');  
        break;     
    }
   }
});

client.on('messageReactionRemove', (reaction,user) => {

  const {name} = reaction.emoji; 
  const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id === '775294723996516352'){
    switch (name){
      case '🍿':
        member.roles.remove('775281264201695282');
        break;
      case '🍎':
        member.roles.remove('775281340547072011');
        break;
      case '🍊':
        member.roles.remove('775281128817950750');  
        break;     
    }
   }
});

client.login(process.env.DISCORD_BOT_TOKEN);
















