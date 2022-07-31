const {Schema, model} = require('mongoose')


const gmSchema = new Schema({
    players: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    username: String
})


module.exports = gmSchema