const {Schema, model} = require('mongoose')


const equipSchema = new Schema({
    name: String,
    type: String,
    definition: String
})

const Equipment = model('Equipment', equipSchema)
module.exports = Equipment