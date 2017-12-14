const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const uuid = require('node-uuid');
const usersData = require("./users");
const uuid = require("node-uuid")

let exportedMethods = {
    async imInterested(interestedUid, interestedInUid) {
        const matchCollection = await matches();
        //first see if there is an existing match between the two users
        let checkMatch = await getMatchByUIDS(interestedUid,interestedInUid)
        if (!checkMatch) {
            let addMatch = await addMatch(interestedUid, interestedInUid)
        } else {
            // this means that user2 has liked user1 before..
            //need to get that record in matches where user2 ID is in the user1 field
        }
    },
    async getMatchByUIDS(user1, user2) {
        const matchCollection = await matches();
        try {
            let match = await userCollection.findOne({
                $or: [
                    {
                        $and: [
                            { user1: user1 },
                            { user2: user2 }
                        ]
                    },
                    {
                        $and: [
                            { user1: user2 },
                            { user2: user1 }
                        ]
                    }
                ]
            });
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
        return this.getMatchByUIDS(user1, user2);
    },

}
module.exports = exportedMethods;
