const {Schema, model} = require('mongoose')
const Character = require('./character')

const personalitySchema = new Schema({
    traits: String,
    ideals: String,
    bonds: String,
    flaws: String, 
    proficiencies: String, 
    languages: String, 
})

const Personality = model('Personality', personalitySchema)
module.exports = Personality