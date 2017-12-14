const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");

let exportedMethods = {
    async getAllUsers() {
       
        console.log(mongoCollections)
        console.log(users);
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    },
    async getUserById(id) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ _id: id });
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getUserByEmail(email) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ email: email });
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addUser(firebaseID,email,lastLogin) {
        console.log("in data, trying to add user");
        let userCollection = await users();

        let existingUser = await userCollection.findOne({_id:firebaseID});

        console.log("in data, checking existing user: " + existingUser);
        if (existingUser) {
            return { error: "user already exists" };
        } else {
            let newUser = {
                _id: firebaseID,
                email: email,
                lastLogin: lastLogin,
                chats: []
            };
            let addedUser = await userCollection.insertOne(newUser);
            return this.getUserById(addedUser.insertedId);
        }
    },
    async removeUser(id) {
        return users().then(userCollection => {
            return userCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete user with id of ${id}`;
                }
            });
        });
    }
};

module.exports = exportedMethods;
