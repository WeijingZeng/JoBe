const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const bluebird = require('bluebird')
const users = data.users;
const potentialMatches = data.matches
const { promisify } = require('util'); //<-- Require promisify
const getIP = promisify(require('external-ip')()); // <-- And then wrap the library
var iplocation = require('iplocation')

// getIP().then((ip) => {
//     console.log(ip);
// }).then((ip) => {
//     iplocation(ip)
//         .then(res => {
//             console.log(`Long: ${res.longitude}, Lat: ${res.latitude} `)
//             return res;
//         }).then((res) => {
//             let lng = res.longitude;
//             let lat = res.latitude
//             dbConnection().then(db => {
//                 return dbConnection().then((db) => {
//                 }).then((db) => {
//                     //firebaseID, username, firstName, lastName, email, gender, city, state, age, long, lat, seeking,
//                     //studioSWUsed, mainGenre, secondGenre, thirdGenre, hasSpace, bio, achivements, role, links, influences, lastLogin,
//                     //profilePhotoUrl, localRemoteOrAll, distanceIfLocal
//                     return users.addUser("8rpjbilwmlUOH3fnlKwBjjbSo9E2", "graffixnyc", "Patrick", "Hill", "graffixnyc@gmail.com", "M",
//                         "Flushing", "NY", 21, lng, lat, "band", "Pro Tools", 1, 3, 9, "Yes, I have a studio space to use", "Test Bio", "I was born, isn't that an achivement enough?",
//                         "bassist", "http://www.patrickhill.nyc", ["Pink Floyd", "The Doors", "Guns N Roses", "Tool"], "Sat, 09 Dec 2017 17:59:02 GMT", "www.myphoto.com/me.jpg", "Local", 10);
//                 }).then((user) => {
//                     console.log("USER:")
//                     console.log(user)
                    
//                 }).then(() => {
//                     console.log("POTENTIAL MATCHES FUNCTION")
//                    let matchs= potentialMatches.getPotentialMatches("8rpjbilwmlUOH3fnlKwBjjbSo9E2")
//                 }).then(() => {
//                     console.log("Done seeding database");
//                     db.close();
//                 });
//             }, (error) => {
//                 console.error(error);
//             });
//         })
// }).catch((error) => {
//     console.error(error);
// });



async function main(){
    
 
     let allUsers=await potentialMatches.getPotentialMatches("8rpjbilwmlUOH3fnlKwBjjbSo9E2");
 console.log(allUsers)
 
 }
 
 main()


