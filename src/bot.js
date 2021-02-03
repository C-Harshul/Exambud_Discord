require('dotenv').config();

const { Client } = require('discord.js');
const google = require('google');

const pic = require('./functions/pic_func')

const client = new Client({
    partials: ['MESSAGE','REACTION']
});

const PREFIX = "$";

client.on('ready',() =>{
 console.log(`${client.user.tag} has logged in`);
});

client.on('message',async (message) =>{
  if(message.author.bot) return;
  
  if(message.content.startsWith(PREFIX)){
    const [CMD_NAME,...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    // console.log(CMD_NAME);
    var tags = args;
    const authorId = message.author.id;
    const authorName = message.author.username;
  
  

    if(CMD_NAME === 'help'){
       
      message.channel.send(" 1.Use ```$addPic <tag1> <tag2>...``` to add the picture to the database \n 2. Use ```$getPic <tag1> <tag2>...``` to get the matching pics from the database \n 3. Use ```$addTags <tag1> <tag2>...``` as a reply to a pic shared by the bot to add tags \n 4.```$search``` and upload pic to get the search link \n 5. ```$read``` and upload pic to just read the text")
       
    }

    else if(CMD_NAME === 'addPic'){
      //Add the pic to the database
      if(message.attachments.array()[0] === undefined){
          message.reply('Attach an image buddy 😪');
          return;
      }
      if(tags == []){
        message.reply('Add some tags');
        return
      }
      const url = message.attachments.array()[0].url;
     await pic.add (authorName,url,tags,authorId)
     .then(user =>{
       console.log(user);
       if(user === "new")
       message.reply('Welcome to the club')
       message.reply('I will remember that 😉')
     }).catch(err => {
       console.log(err)
       message.reply("Some problem occured while adding to the database")
      })

    }


    else if(CMD_NAME === 'addQuote'){
      //Add the quote to the database  
    }




    else if(CMD_NAME === 'getPic'){
      //Get the pic of someone - based on tag 
      await pic.get(authorId,authorName,tags)
      .then(Docs =>{
        console.log(Docs)
        let docs = Docs["docs"]   
        let files = [];
        for(let i = 0;i<docs.length;++i){
           if( i == 0 )
            message.channel.send('Here are the matching tags...'); 
            files.push(docs[i].url);
            console.log(docs[i].tags);
            var tags = '';
            for(let j in docs[i].tags){
                tags += docs[i].tags[j] + "  ,  ";
            }
            message.channel.send(tags+"\n"+docs[i].url);
        }
        console.log(files);
        if(files.length === 0){
            message.reply(' provided tags not found 😐');
        } 
      }).catch(err => {
        console.log(err)
        message.reply("Some problem occured while retrieving the pics")
       })
    }
    else if(CMD_NAME === 'addTags'){
      
       if(message.reference !== null){
         var imgUrl = ''; 
        
        await message.channel.messages.fetch(message.reference.messageID)
        .then(msg => {
          
          //console.log(msg);
          if(msg.author.id !== "775401166230126593"){
            if(msg.attachments.array()[0].url !== undefined){ 
            imgUrl = msg.attachments.array()[0].url;
            }
            else
            message.reply("No attachment found in the message");  
          }
          else {
            if(msg.embeds[0] === undefined ){
              message.reply("No attachment found in the message")
            }
            
            imgUrl = msg.embeds[0].url;
          }
          
        })
        .catch(console.error);
        pic.addTags(imgUrl,tags)
        .then(s =>{
          if(s === 1)
          message.reply("The tags were added")
        }).catch(e =>{
          message.send("Some problem occured while adding the tags")
        })
      }
       else{
         message.reply('This command can be used only as a reply')
       } 
    }
    else if(message.attachments && CMD_NAME === 'search'){
      var url = message.attachments.array()[0].url;
      var recognisedText = ''
      await pic.getText(url)
      .then(text =>{
        recognisedText = text
      }).catch(err =>{
        console.log(err)
        message.reply("Could not recognise the text");
      }); 
      message.channel.send("Please Wait...")
      await google(recognisedText, (err, res) => {
        if (err) console.error(err);
        recognisedText = recognisedText + '\n Search .....\n' + res.url; 
        message.channel.send(recognisedText);
      });
     
    }
    
    else if(message.attachments && CMD_NAME === 'read'){
      var url = message.attachments.array()[0].url;
      //console.log(message.attachments.array()[0].url)
      var recognisedText = ""
      message.channel.send("Please Wait...")
      await pic.getText(url)
      .then(text =>{
        recognisedText = text
      })
      .catch((err) =>{
        console.log(err);
      });
      message.channel.send(recognisedText);
    }
    else {
      message.channel.send("** Invalid command check the following **\n1.Use ```$addPic <tag1> <tag2>...``` to add the picture to the database \n 2. Use ```$getPic <tag1> <tag2>...``` to get the matching pics from the database \n 3. Use ```$addTags <tag1> <tag2>...``` as a reply to a pic shared by the bot to add tags \n 4.```$search``` and upload pic to get the search link \n 5. ```$read``` and upload pic to just read the text")
    } 
  } 


});


client.login(process.env.DISCORD_BOT_TOKEN);