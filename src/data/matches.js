const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const uuid = require("node-uuid");
const usersData = require("./users");

let exportedMethods = {
    async imInterested(interestedUid, interestedInUid) {
        const matchCollection = await matches();
        //first see if there is an existing match between the two users
        let checkMatch = await this.getMatchByUIDS(
            interestedUid,
            interestedInUid
        );
        //If there is no matching match document already then create one
        if (!checkMatch) {
            let addMatch = await this.addMatch(interestedUid, interestedInUid);
            return addMatch;
        } else {
            // this means that user2 has liked user1 before..and for whatever reason, maybe user1 didn't see
            //that user2 liked them before so they clicked like when coming across user2's profile
            //need to get that record in matches where user2 ID is in the user1 field
            if (interestedUid !== checkMatch.user1) {
                let setMutualMatch = await this.setMutual(checkMatch._id);
                return setMutualMatch;
            }
        }
    },
    //This function will get the match record if both users are in either the user1 or user2 fields, mutual does not have to be 1
    async getMatchByUIDS(user1, user2) {
        const matchCollection = await matches();
        try {
            let match = await matchCollection.findOne({
                $or: [
                    {
                        $and: [{ user1: user1 }, { user2: user2 }]
                    },
                    {
                        $and: [{ user1: user2 }, { user2: user1 }]
                    }
                ]
            });
            return match;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async setMutual(matchID) {
        const matchCollection = await matches();
        let updateMutual = {
            mutualMatch: 1
        };
        let updateCommand = {
            $set: updateMutual
        };
        let mutualMatch = await matchCollection.updateOne(
            { _id: matchID },
            updateCommand
        );
        return await this.getMatchByMatchID(matchID);
    },
    async getMatchByMatchID(matchID) {
        const matchCollection = await matches();
        let match = await matchCollection.findOne({ _id: matchID });
        return match;
    },
    //This function returns the mutual matches for a user
    async getMutualMatches(uid) {
        const matchCollection = await matches();
        try {
            let matches = await matchCollection
                .find({
                    $and: [
                        { mutualMatch: 1 },
                        {
                            $or: [{ user1: uid }, { user2: uid }]
                        }
                    ]
                })
                .toArray();

            let match = await Promise.all(
                matches.map(async m => {
                    let otherId = null;
                    if (m.user1 === uid) {
                        otherId = m.user2;
                    } else {
                        otherId = m.user1;
                    }
                    return await usersData.getUserById(otherId);
                })
            );
            return match;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    //This function adds a new match to the match document
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
    }
};
module.exports = exportedMethods;
