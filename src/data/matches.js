const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const uuid = require('node-uuid');
const usersData = require("./users");

let exportedMethods = {

    async getPotentialMatches(uid) {
        let user = await usersData.getUserById(uid)
        console.log(user)
        //here is where we need to search users based on the users's profile
        // like genre, influences, people who are looking for the searcher's role "Guitarist"
        // and people who the searcher is looking for
    },
    async imInterested(interestedUid, interestedInUid) {
        let user1 = await usersData.getUserById(interestedUid)
        console.log(user1)
        let user2 = await usersData.getUserById(interestedInUid)
        console.log(user2)

    }

}

module.exports = exportedMethods;
