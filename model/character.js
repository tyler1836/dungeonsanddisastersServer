const {Schema, model} = require('mongoose')


const characterSchema = new Schema({
    name: String,
    stats: [
        {
            type: Schema.Types.ObjectId,
            ref: "Stat"
        }
    ],
    personality: [
        {
            type: Schema.Types.ObjectId,
            ref: "Personality"
        }
    ],
    equipment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Equipment"
        }
    ],
    race: String,
    alignment: String,
    background: String,
    class: String,
    createdAt: String,
    gm: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    //add party members?
})
characterSchema.pre('findByIdAndRemove', function(next) {
    Equipment.remove({characterId: this._id}).exec()
    Stats.remove({characterId: this._id}).exec()
    Personality.remove({characterId: this._id}).exec()
    next()
})
const Character = model('Character', characterSchema)
module.exports = Character