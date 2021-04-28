const mongoose = require('mongoose')
const User = require('../models/user')
const Group = require('../models/group')

mongoose.connect('mongodb+srv://harshul:harshul@cluster0.dbkis.mongodb.net/DeskAssign?retryWrites=true&w=majority',
 {
   useUnifiedTopology: true,
   useNewUrlParser: true
 }
);

const create = async (name,password,ownerId) => {
  try{
    const newGroup = new Group({
        name : name,
        owner : ownerId,
        adminPassword : password,
        members : [ownerId]
    })
 
    await newGroup.save()
  } catch(e) {
    console.log(e)
  }
}

