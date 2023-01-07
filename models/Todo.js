const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    title:String,
    color:String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    date:{
        type: Date,
        default: Date.now
    },
    tasks:[String]
   
},
{
    timestamps:true
}
)

module.exports = mongoose.model('todo', ToDoSchema);
