require('dotenv').config();

const { Client } = require('discord.js');
const google = require('google');
const mongoose = require('mongoose');

const axios = require('axios');
const Pic = require('./models/pic');
const User = require('./models/user');

const client = new Client({
    partials: ['MESSAGE','REACTION']
});


mongoose.connect('mongodb+srv://harshul:harshul@cluster0.dbkis.mongodb.net/DeskAssign?retryWrites=true&w=majority',
 {
   useUnifiedTopology: true,
   useNewUrlParser: true
 }
);

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
      const newPic = new Pic({
          _id : new mongoose.Types.ObjectId(),
          author:message.author.username,
          url:url,
          tags:tags
      });
      
      await User.find({_id:authorId})
      .exec()
      .then(doc =>{
          if(doc.length == 0){
                let newUser = new User({
                _id : authorId,
                name: authorName,
            })
            newUser.save()
            .then(res =>{
              console.log(res);
              message.reply('Welcome to the club 🎉🎉') 
            });
           }
      }).catch(err =>{console.log(err)});
      newPic.save()
      .then(res =>{
          console.log(res);
          message.reply('I will remember that 😉');
        }).catch(err =>{console.log(err)});
    }




    else if(CMD_NAME === 'addQuote'){
      //Add the quote to the database  
    }




    else if(CMD_NAME === 'getPic'){
      //Get the pic of someone - based on tag 
      await User.find({_id:authorId})
      .exec()
      .then(doc =>{
          if(doc.length == 0){
                let newUser = new User({
                _id : authorId,
                name: authorName,
            })
            newUser.save()
            .then(res =>{
              console.log(res);
              message.reply('Welcome to the club 🎉🎉') 
            });
           }
      }).catch(err=>{console.log(err)});
       await Pic.find({ tags: { $all: tags } } )
       .exec()
       .then(docs => {
         
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
        
       });
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
      
        await Pic.find({url:imgUrl})
         .then(docs =>{
          
            var newTags = docs[0].tags;
            for(let i = 0; i<tags.length; ++i){
              newTags.push(tags[i]);
            }
            // console.log(newTags);
            Pic.findOneAndUpdate({url:imgUrl},{tags:newTags})
            .then(doc =>{
              message.reply("The tags were added");
            // console.log(doc);
            })
            .catch(e =>console.log(e))
           });  
         }
       else{
         message.reply('This command can be used only as a reply')
       } 
    }
    else if(message.attachments && CMD_NAME === 'search'){
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
    }else if(message.attachments && CMD_NAME === 'read'){
      var url = message.attachments.array()[0].url;
      // console.log(url);
      var apiUrl = 'https://api.ocr.space/parse/imageurl?apikey=c44024397388957&url=' + url;
      await axios.get(apiUrl)
      .then(async(response) =>{
        text = response.data['ParsedResults'][0]['ParsedText'];
      })
      .catch((err) =>{
        console.log(err);
      });
      message.channel.send(text);
    }
    else {
      message.channel.send("** Invalid command check the following **\n1.Use ```$addPic <tag1> <tag2>...``` to add the picture to the database \n 2. Use ```$getPic <tag1> <tag2>...``` to get the matching pics from the database \n 3. Use ```$addTags <tag1> <tag2>...``` as a reply to a pic shared by the bot to add tags \n 4.```$search``` and upload pic to get the search link \n 5. ```$read``` and upload pic to just read the text")
    } 
  } 


});


client.login(process.env.DISCORD_BOT_TOKEN);