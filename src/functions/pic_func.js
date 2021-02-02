const mongoose = require('mongoose');
const axios = require('axios');

const Pic = require('../models/pic');
const User = require('../models/user');

mongoose.connect('mongodb+srv://harshul:harshul@cluster0.dbkis.mongodb.net/DeskAssign?retryWrites=true&w=majority',
 {
   useUnifiedTopology: true,
   useNewUrlParser: true
 }
);

var user = "old"

async function addPic (authorName,url,tags,authorId) {
    const newPic = new Pic({
        _id : new mongoose.Types.ObjectId(),
        author:authorName, /*author*/
        url:url,/*url*/
        tags:tags /*tags*/
    });
    
    await User.find({_id:authorId})
    .exec()
    .then(doc =>{
        if(doc.length == 0){
              user = "new" 
              let newUser = new User({
              _id : authorId,
              name: authorName,
          })
          newUser.save()
          .then(res =>{
            console.log(res);
            
          });
         }
    }).catch(err =>{console.log(err)});
    newPic.save()
    .then(res =>{
        console.log(res);
        // message.reply('I will remember that 😉');
      }).catch(err =>{console.log(err); return err});
   return user
 }

async function getPic (authorId,authorName,tags){
  var Docs = new Object()
  await User.find({_id:authorId})
      .exec()
      .then(user =>{
          console.log()
          if(user.length == 0){
            user = "new"
                let newUser = new User({
                _id : authorId,
                name: authorName,
            })
            newUser.save()
            .then(res =>{
              console.log(res);
            });
           }
      }).catch(err=>{console.log(err)});
       await Pic.find({ tags: { $all: tags } } )
       .exec()
       .then(docs => {
         
         
         Docs['docs'] = docs
         console.log(docs)
          
        
       });
       return Docs 
}

async function addTags (imgUrl,tags) {
      
  await Pic.find({url:imgUrl})
  .then(docs =>{
   
     var newTags = docs[0].tags;
     for(let i = 0; i<tags.length; ++i){
       newTags.push(tags[i]);
     }
      Pic.findOneAndUpdate({url:imgUrl},{tags:newTags})
     .then(doc =>{
       console.log(doc);
     })
     .catch(e =>{console.log(e); return e})
    });       
    return 1
}

async function getText (url){
  var apiUrl = 'https://api.ocr.space/parse/imageurl?apikey=c44024397388957&url=' + url;
  var text = "";
  await axios.get(apiUrl)
  .then(async(response) =>{
    text = response.data['ParsedResults'][0]['ParsedText'];
  }).catch(err =>{
    console.log(err);
  });
  console.log(text)
  return text
}

exports.add = addPic
exports.get = getPic
exports.getText = getText
exports.addTags = addTags
