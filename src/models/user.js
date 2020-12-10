const mongoose = require('mongoose');

const user = mongoose.Schema({
 
   _id : String,
   name: String,
   Quote:String

});

module.exports= mongoose.model('User',user);