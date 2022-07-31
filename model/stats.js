const {Schema, model} = require('mongoose')
const Character = require('./character.js')

const statSchema = new Schema({
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
    perception: Number,
    speed: Number,
    health: Number, 
    level: Number,
    experience: Number,
    tempExp: Number
})

const Stats = model('Stat', statSchema)
module.exports = Stats