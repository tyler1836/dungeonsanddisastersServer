const { gql } = require('apollo-server-express');

module.exports = gql`
type Character {
  _id: ID
  name: String
  # nested arrays of types
  stats: [Stat]
  personality: [Personality]
  equipment: [Equipment]
  # 
  class: String
  race: String
  alignment: String
  background: String
  createdAt: String
}
type Stat{
    _id: ID
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
    perception: Int
    speed: Int
    health: Int 
    level: Int 
    experience: Int
    tempExp: Int
}
type Personality{
    _id: ID
    traits: String 
    ideals: String 
    bonds: String
    flaws: String 
    proficiencies: String 
    languages: String 
}
type Equipment{
    _id: ID
    name: String
    type: String
    definition: String
}
type User {
  _id: ID
  username: String
  password: String
  email: String
  createdAt: String
  isGm: Boolean
  characters: [Character]
  gamemasters: [User]
}
type Gamemaster{
    _id: ID
    users: [User]
}
type Auth{
  token: ID!
  user: User
}
type Query {
  me: User
  users: [User]
  characters: [Character]
  character(_id: ID!): Character 
  gamemasters: [Gamemaster]
  gamemaster: Gamemaster 
  stats: [Stat]
  equipment: [Equipment]
  personality: [Personality]
}
type Mutation {
  login(
    email: String!, 
    password: String!
    ): Auth
  addUser(
    username: String!, 
    email: String!, 
    password: String! 
    isGm: Boolean!
    ): Auth
  addCharacter(
    name: String!,
    race: String!,
    alignment: String!,
    class: String! 
    background: String!
    ): Character
  deleteCharacter(
    characterId: ID!
  ): Character
  updateClass(
    characterId: ID!
    class: String!
  ): Character
  addStats(
    characterId: ID!
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
    perception: Int
    speed: Int
    health: Int 
    level: Int
    experience: Int
    tempExp: Int
    ): Stat
  addPersonality(
    characterId: ID!
    traits: String 
    ideals: String 
    bonds: String
    flaws: String 
    proficiencies: String 
    languages: String 
  ): Personality
  addEquipment(
    characterId: ID!
    name: String!
    type: String!
    definition: String!
  ): Equipment
  deleteEquipment(
    characterId: ID!
    equipmentId: ID!
  ): Equipment
  levelUp(
    characterId: ID!
    statId: ID!
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
    perception: Int
    health: Int 
    level: Int
    experience: Int
    speed: Int
    tempExp: Int
  ): Stat
}`