const mongoose = require('mongoose');

const Pic = mongoose.Schema({
 
    _id:mongoose.Schema.Types.ObjectId,
    author:String,
    url:String,
    tags:mongoose.Schema.Types.Mixed
     
});

module.exports = mongoose.model('Pic',Pic);