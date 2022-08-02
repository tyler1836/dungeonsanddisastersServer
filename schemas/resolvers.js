const {
    User,
    Character,
    Gamemaster,
    Personality,
    Stats,
    Equipment } = require('../model')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        users: async (parent, args) => {
            const users = await User.find().select('-__v -password')
            return users
        },
        me: async (parent, args, context) => {
            const user = await User.find()
            if (context.user) {
                const userData = User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    //multiple populates second populate pertain to first populates model
                    .populate({
                        path: 'characters',
                        model: 'Character',
                        populate: [
                            {
                                path: 'stats',
                                model: 'Stat',
                            },
                            {
                                path: 'equipment',
                                model: 'Equipment'
                            },
                            {
                                path: 'personality',
                                model: 'Personality'
                            }
                        ],
                    })
                return userData;
            }

            throw new AuthenticationError('Please log in!')
        },
        character: async (parent, args) => {
            const char = await Character.findById({ _id: args._id })
                .populate('stats')
                .populate('personality')
                .populate('equipment')
            return char
        },
        characters: async (parent, args, context) => {
            if (context.user) {
                const char = await Character.find().populate('stats')
                return char
            }

            throw new AuthenticationError('Please log in!')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            // args are the variables from graphql
            const user = await User.create(args)
            //set up jwt token
            const token = signToken(user)

            return { token, user }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const correctPw = await user.isCorrectPassword(password)

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const token = signToken(user)
            return { token, user }
        },
        addCharacter: async (parent, args, context) => {
            console.log(args)
            if (context.user) {
                const char = await Character.create(args)
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { characters: char } },
                    { new: true }
                )
                return user
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        deleteCharacter: async (parent, { characterId }) => {
            const cascadeChar = await Character.findById(characterId)
            /* Pull out associated ids from character to have auto delete dependencies on character delete
            run through an if statement in case there are no stats/equipment/personality 
            allows function to be be carried out if something hasn't been added yet 
            .remove('stats').remove('personality').remove('equipment')
            */
            const assocStats = cascadeChar.stats[0]._id
            const assocEquip = cascadeChar.equipment[0]
            const assocPersonality = cascadeChar.personality[0]._id
            if(assocStats){
             
                await Stats.findByIdAndDelete(assocStats)
            }
            if(assocEquip){
               
                await Equipment.findByIdAndDelete(assocEquip)
            }
            if(assocPersonality){
          
                await Personality.findByIdAndDelete(assocPersonality)
            }
            const char = await Character.findByIdAndRemove(characterId)
            return char
        },
        updateClass: async (parent, args) => {
            const char = await Character.findByIdAndUpdate(
                {_id: args.characterId},
                {class: args.class },
                {new: true}
            )
            return char
        },
        //destructure args so characterid isnt passed as a stat
        addStats: async (parent, {
            characterId,
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma,
            perception,
            speed,
            health,
            level, 
            experience
        }) => {

            const stat = await Stats.create({
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma,
                perception,
                speed,
                health,
                level,
                experience
            })
            const character = await Character.findByIdAndUpdate(
                { _id: characterId },
                //stats comes from mongoose schema not graphql
                { $push: { stats: stat } },
                { new: true }
            )
            console.log(stat)
            return character

        },
        addPersonality: async (parent, {
            characterId,
            traits,
            ideals,
            bonds,
            flaws,
            proficiencies,
            languages
        }) => {

            const personal = await Personality.create({
                traits,
                ideals,
                bonds,
                flaws,
                proficiencies,
                languages
            })
            const char = await Character.findByIdAndUpdate(
                { _id: characterId },
                { $push: { personality: personal } },
                { new: true }
            )
            return char
        },
        updatePersonality: async (parent, {
            characterId,
            personalityId,
            traits,
            ideals,
            bonds,
            flaws,
            proficiencies,
            languages

        }) => {
            const char = await Character.findById(characterId)
            console.log(char)
            const updatePersonality = await Personality.findByIdAndUpdate(
                {_id: personalityId},
                {
                 traits: traits,
                 ideals: ideals,
                 bonds: bonds,
                 flaws: flaws,
                 proficiencies: proficiencies,
                 languages: languages
                },
                {new: true}
            )
            const updateCharacterPersonality = await Character(
                {_id: characterId},
                {$pull: {updatePersonality}},
                {$push: {personality: updatePersonality}},
                {new: true}
                )
        },
        addEquipment: async (parent, {
            characterId,
            name,
            type,
            definition
        }) => {
            const bag = await Equipment.create({
                name,
                type,
                definition
            })
            const character = await Character.findByIdAndUpdate(
                { _id: characterId },
                { $push: { equipment: bag } },
                { new: true }
            )
            return character
        },
        deleteEquipment: async (parent, args) => {
            const item = await Equipment.findById({_id: args.equipmentId})
            const char = await Character.findByIdAndUpdate(
                {_id: args.characterId},
                {$pull: {equipment: item._id}},
                {new: true}
                )
            const deleteItem = await Equipment.findByIdAndDelete({_id: args.equipmentId})
            return {char}
        },
        levelUp: async (parent, {
            characterId,
            statId,
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma,
            perception,
            health,
            level,
            experience,
            speed,
            tempExp
        }) => {
            const stats = await Stats.findByIdAndUpdate(
                {_id: statId},
                {
                strength: strength,
                dexterity: dexterity,
                constitution: constitution,
                intelligence: intelligence,
                wisdom: wisdom,
                charisma: charisma,
                perception: perception,
                health: health,
                speed: speed,
                level: level,
                experience: experience,
                tempExp: tempExp
                },
                {new: true}
            )
            const char = await Character.findByIdAndUpdate(
                {_id: characterId},
                {$pull: {stats}},
                {$push: {stats: stats}},
                {new: true}
            )
            return {char, stats}
        }
    }
}

module.exports = resolvers