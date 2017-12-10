const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    },
    async getUserById(id) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ _id: id })
            return user;
        }catch(e) {
            console.log('there was an error');
            console.log(e); 
          }
    },
    async getUserByUsername(username) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ username: username })
            return user;
        }catch(e) {
            console.log('there was an error');
            console.log(e); 
          }
    },
    async getUserByUsernameOrEmail(username, email) {
        return users().then((userCollection) => {
            return userCollection.findOne({ $or: [{ username: username }, { email: email }] }).then((user) => {
                return user;
            });
        });
    },
    /*    Add user, firebaseID will come from the app state user object, location will be long and lat, so the profile form
          should read the users location based on IP address, look into the node package , lastLogin will also come from the app state user object, the profile form
          should upload an image and then pass the URL to this method. localRemoteOrAll will be if they are looking to work
          with people just locally, remotely or are open to any. If the select local only then  distanceIfLocal will store
          how far around their location they are willing to go
    */
    async addUser(firebaseID, username, firstName, lastName, email, gender, city, state, age, long, lat, seeking,
        studioSWUsed, mainGenre, secondGenre, thirdGenre, hasSpace, bio, achivements, role, links, influences, lastLogin,
        profilePhotoUrl, localRemoteOrAll, distanceIfLocal) {
        //need error checking here to make sure all fields are supplied and also need to check that their handle is unique 
        let userCollection = await users();
        //here we check if the username(handle) supplied is unique if it's not, then there
        // will be an error returned and if it is then it goes ahead and adds the user
        let existingUser=await this.getUserByUsername(username.toLowerCase());
        if (existingUser){
            return {error: "Username is not unique"};
        }else{
            let newUser = {
                _id: firebaseID,
                username: username.toLowerCase(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                city: city,
                state: state,
                age: age,
                location: { long, lat },
                seeking: seeking,
                studioSWUsed: studioSWUsed,
                mainGenre: mainGenre,
                secondGenre: secondGenre,
                thirdGenre: thirdGenre,
                hasSpace: hasSpace,
                bio: bio,
                achivements: achivements,
                role: role,
                links: links,
                influences: influences,
                matchingActive: 1,
                lastLogin: lastLogin,
                profilePhotoUrl: profilePhotoUrl,
                profileViewCount: 0,
                adminUser: 0,
                localRemoteOrAll: localRemoteOrAll,
                distanceIfLocal: distanceIfLocal
            }
            let addedUser = await userCollection.insertOne(newUser)
            return this.getUserById(addedUser.insertedId);
        }
    },
    async removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
}

module.exports = exportedMethods;
