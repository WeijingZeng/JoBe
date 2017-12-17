const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const bluebird = require('bluebird')
const users = data.users;
const potentialMatches = data.matches
const { promisify } = require('util'); //<-- Require promisify
const getIP = promisify(require('external-ip')()); // <-- And then wrap the library
var iplocation = require('iplocation')

var sample_data = require("../data/sample_data.json");
const fire = require("../config/firebase-auth-seed");

seed();

function seed() {
    for (let i = 0; i < sample_data.length; i++) {
        fire.fetch(sample_data[i]['email']).then((user) => {
            users.addUser(user.uid, sample_data[i]['username'], sample_data[i]['firstName'], sample_data[i]['lastName'], sample_data[i]['email'], sample_data[i]['gender'],
                sample_data[i]['city'], sample_data[i]['state'], sample_data[i]['age'], sample_data[i]['long'], sample_data[i]['lat'], sample_data[i]['seeking'],
                sample_data[i]['studioSWUsed'], sample_data[i]['mainGenre'], sample_data[i]['secondGenre'], sample_data[i]['thirdGenre'], sample_data[i]['hasSpace'], sample_data[i]['bio'], sample_data[i]['achievements'],
                sample_data[i]['role'], sample_data[i]['links'], sample_data[i]['influences'], sample_data[i]['lastLogin'], sample_data[i]['profilePhotoUrl'], sample_data[i]['localRemoteOrAll'], sample_data[i]['distanceIfLocal'])
            console.log(user.uid + " added");
            return;
        }).catch((err) => {
            console.log(err);
        })
    }
}




// async function main(){


//      let allUsers=await potentialMatches.getPotentialMatches("8rpjbilwmlUOH3fnlKwBjjbSo9E2");
//  console.log(allUsers)

//  }

//  main()


