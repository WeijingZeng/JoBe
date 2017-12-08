const mongoCollections = require("../config/mongoCollections");
const matches= mongoCollections.matches;
const uuid = require('node-uuid');
const usersData = require("./users");

let exportedMethods = {
    
    async getPotentialMatches(uid){

    },
   async imInterested(interestedUid,interestedInUid ){

    }
   
}

module.exports = exportedMethods;
