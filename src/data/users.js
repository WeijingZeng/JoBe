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
        const user = await userCollection.findOne({ _id: id })
        if (!user) throw "User Not Found";
        return user;
    },
    async getUserByUsername(username) {
        const userCollection = await users();
        const user = await userCollection.findOne({ username: username })
        if (!user) throw "User Not Found";
        return user;
    },
    async getUserByUsernameOrEmail(username, email) {
        return users().then((userCollection) => {
            return userCollection.findOne({ $or: [{ username: username }, { email: email }] }).then((user) => {
                return user;
            });
        });
    },
    async addUser(firebaseID, username, firstName, lastName, email, gender, city, state, age, location, seeking,
        studioSWUsed, mainGenre, secondGenre, thirdGenre, hasSpace, bio, achivements, role, links, influences, lastLogin,
        profilePhotoUrl) {
        //need error checking here to make sure all fields are supplied and also need to check that their handle is unique 
        let userCollection = await users();
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
            location: location,
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
            profilePhotoUrl: profilePhotoURL,
            profileViewCount: 0,
            adminUser: 0,

        }
        return await userCollection.insertOne(newUser)
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
