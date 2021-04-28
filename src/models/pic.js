const mongoose = require('mongoose');

const picSchema = mongoose.Schema({
 
    author:String,
    url:String,
    groups : [{
        group : {
            type : mongoose.Schema.Types.ObjectId
        }
    }],
    tags:mongoose.Schema.Types.Mixed
     
});

module.exports = mongoose.model('Pic',picSchema);