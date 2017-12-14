const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const uuid = require('node-uuid');
const usersData = require("./users");
const uuid = require("node-uuid")

let exportedMethods = {
    async imInterested(interestedUid, interestedInUid) {
        const matchCollection = await matches();
        let user1 = await usersData.getUserById(interestedUid)
        console.log(user1)
        let user2 = await usersData.getUserById(interestedInUid)
        console.log(user2)
        //first see if user2 has liked user1 before
        let checkMatch = await checkInterestedByID(user2)
        if (!checkMatch) {
            let addMatch = await addMatch(user1, user2)
        } else {
            // this means that user2 has liked user1 before..
            //need to get that record in matches where user2 ID is in the user1 field
        }
    },
    async checkInterestedByID(id) {
        const matchCollection = await matches();
        try {
            let match = await userCollection.findOne({ user1: id });
            return match;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addMatch(user1, user2) {
        const matchCollection = await matches();
        let newMatch = {
            _id: uuid.v4(),
            user1: user1,
            user2: user2,
            mutualMatch: 0
        };
        let addedMatch = await matchCollection.insertOne(newMatch);
        return this.checkInterestedByID(user1);
    },

}
module.exports = exportedMethods;
