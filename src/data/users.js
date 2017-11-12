const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');
var firebase = require('firebase');
var firebaseui = require('firebaseui');
var auth = firebase.auth();
var config = {
    apiKey: "AIzaSyCbb4SNcbrKwQsSxegT7A9TjsjG7jkYGBs",
    authDomain: "jobe-b84fc.firebaseapp.com",
    databaseURL: "https://jobe-b84fc.firebaseio.com",
    storageBucket: "jobe-b84fc.appspot.com",
    projectId: "jobe-b84fc",
    messagingSenderId: "447681007576",
};
firebase.initializeApp(config);

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
    async addUser(username, firstName, lastName, email, gender, city, state, age, hashedPassword) {
        //need error checking here

        if (username === undefined || username === "") return Promise.reject("No username given");
        if (firstName === undefined || firstName === "") return Promise.reject("No first name given");
        if (lastName === undefined || lastName === "") return Promise.reject("No last name given");
        if (email === undefined || email === "") return Promise.reject("No email given");
        if (gender === undefined || gender === "") return Promise.reject("No gender given");
        if (city === undefined || city === "") return Promise.reject("No city given");
        if (state === undefined || state === "") return Promise.reject("No state given");
        if (age === undefined || age === "") return Promise.reject("No age given");
        if (hashedPassword === undefined || hashedPassword === "") return Promise.reject("No password given");

        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                username: username.toLowerCase(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                city: city,
                state: state,
                age: age,
                password: hashedPassword,
                pollsCreated: [],
                pollsVotedIn: []
            };
            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });

    },

    createHashedPassword(password) {
        return new Promise((fulfill, reject) => {
            if (!password) reject("Password not given");
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) reject(err);
                    fulfill(hash);
                });
            });
        });

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
    isPasswordValid(user, password) {
        return new Promise((fulfill, reject) => {
            if (!user) reject("User not given");
            if (!password) reject("Password not given");
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) reject(err);
                fulfill(res);
            });

        });

    }
}

module.exports = exportedMethods;
