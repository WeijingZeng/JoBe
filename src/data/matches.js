const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const uuid = require('node-uuid');
const usersData = require("./users");

let exportedMethods = {

    async getPotentialMatches(uid) {
        let user = await usersData.getUserById(uid)
        console.log(user.location.coordinates[0])
        console.log(user.location.coordinates[1])
        console.log(user.role)
        //here is where we need to search users based on the users's profile
        // like genre, influences, people who are looking for the searcher's role "Guitarist"
        // and people who the searcher is looking for
        let userList= await usersData.getUsersNear(user.location.coordinates[0],user.location.coordinates[1], 10,user.role)
        console.log(userList)
          return userList
    },
    async imInterested(interestedUid, interestedInUid) {
        let user1 = await usersData.getUserById(interestedUid)
        console.log(user1)
        let user2 = await usersData.getUserById(interestedInUid)
        console.log(user2)
        //here, we need to insert each id into the match mongo "table" and then notify they user someone is interested.
        //then if that person is interested back.  set the mutual match field on the "row" in the match "table" to true.  This
        //is how we will know they both are interested in each other and it will create the collaboration space.
        // also we can show a list of people who are interested in the user here.. just query the matches where a userID
        // is the interestedInUid


    }

}
module.exports = exportedMethods;
