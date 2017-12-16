const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const matches = mongoCollections.matches;
const uuid = require("node-uuid");

let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    },
    async getPotentialMatches(uid) {
        let user = await this.getUserById(uid);
        let long = user.location.coordinates[0];
        let lat = user.location.coordinates[1];
        let maxDistanceInMiles = user.distanceIfLocal;
        let role = user.role;
        let mainGenre = user.mainGenre;
        let secondGenre = user.secondGenre;
        let thirdGenre = user.thirdGenre;
        let influences = user.influences;
        let localRemoteOrAll = user.localRemoteOrAll;
        let userList = null;
        const userCollection = await users();
        if (localRemoteOrAll === "Local" || localRemoteOrAll === "All") {
            //convert the number of miles into meters
            let maxDistance = maxDistanceInMiles * 1609.34;
            userList = await userCollection
                .find({
                    $and: [
                        { seeking: role },
                        { matchingActive: 1 },
                        { influences: { $in: influences } },
                        {
                            $or: [
                                { mainGenre: { $in: [mainGenre, secondGenre, thirdGenre] } },
                                { secondGenre: { $in: [mainGenre, secondGenre, thirdGenre] } },
                                { thirdGenre: { $in: [mainGenre, secondGenre, thirdGenre] } }
                            ]
                        },
                        {
                            location: {
                                $near: {
                                    $geometry: { type: "Point", coordinates: [long, lat] },
                                    $minDistance: 0,
                                    $maxDistance: maxDistance
                                }
                            }
                        }
                    ]
                })
                .toArray();
        } else {
            //they do not care about location so run query without location filters
            userList = await userCollection
                .find({
                    $and: [
                        { seeking: role },
                        { matchingActive: 1 },
                        { influences: { $in: influences } },
                        {
                            $or: [
                                { mainGenre: { $in: [mainGenre, secondGenre, thirdGenre] } },
                                { secondGenre: { $in: [mainGenre, secondGenre, thirdGenre] } },
                                { thirdGenre: { $in: [mainGenre, secondGenre, thirdGenre] } }
                            ]
                        }
                    ]
                })
                .toArray();
        }
        const matchCollection = await matches();

        let mutual = await matchCollection
            .find({
                $and: [
                    { mutualMatch: 1 },
                    {
                        $or: [{ user1: uid }, { user2: uid }]
                    }
                ]
            })
            .toArray();

        let filtered = userList.filter(u => {
            let r = mutual.findIndex(m => {
                return m.user1 === u._id || m.user2 === u._id;
            });
            return r === -1;
        });
        return filtered;
    },
    async getUserById(id) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ _id: id });
            if (!user) return { error: "User not found" };
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getUserByUsername(username) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ username: username });
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getUserByUsernameOrEmail(username, email) {
        return users().then(userCollection => {
            return userCollection
                .findOne({ $or: [{ username: username }, { email: email }] })
                .then(user => {
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
    async addUser(
        firebaseID,
        username,
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        long,
        lat,
        seeking,
        studioSWUsed,
        mainGenre,
        secondGenre,
        thirdGenre,
        hasSpace,
        bio,
        achivements,
        role,
        links,
        influences,
        lastLogin,
        profilePhotoUrl,
        localRemoteOrAll,
        distanceIfLocal
    ) {
        //need error checking here to make sure all fields are supplied and also need to check that their handle is unique
        let userCollection = await users();
        //here we check if the username(handle) supplied is unique if it's not, then there
        // will be an error returned and if it is then it goes ahead and adds the user
        let existingUser = await this.getUserByUsername(username.toLowerCase());
        if (existingUser) {
            return { error: "Username is not unique" };
        } else {
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
                location: {
                    type: "Point",
                    coordinates: [Number(long), Number(lat)]
                },
                seeking: seeking,
                studioSWUsed: studioSWUsed,
                mainGenre: Number(mainGenre),
                secondGenre: Number(secondGenre),
                thirdGenre: Number(thirdGenre),
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
            };
            await userCollection.createIndex({ location: "2dsphere" });
            let addedUser = await userCollection.insertOne(newUser);
            return this.getUserById(addedUser.insertedId);
        }
    },
    async editUser(
        firebaseID,
        username,
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        long,
        lat,
        seeking,
        studioSWUsed,
        mainGenre,
        secondGenre,
        thirdGenre,
        hasSpace,
        bio,
        achivements,
        role,
        links,
        influences,
        lastLogin,
        profilePhotoUrl,
        localRemoteOrAll,
        distanceIfLocal
    ) {
        //need error checking here to make sure all fields are supplied and also need to check that their handle is unique
        let userCollection = await users();
        //here we check if the username(handle) supplied is unique if it's not, then there
        // will be an error returned and if it is then it goes ahead and adds the user
        let updatedUser = {
            _id: firebaseID,
            username: username.toLowerCase(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            city: city,
            state: state,
            age: age,
            location: {
                type: "Point",
                coordinates: [Number(long), Number(lat)]
            },
            seeking: seeking,
            studioSWUsed: studioSWUsed,
            mainGenre: Number(mainGenre),
            secondGenre: Number(secondGenre),
            thirdGenre: Number(thirdGenre),
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
        };
        let updateCommand = {
            $set: updatedUser
        };

        let editedUser = await userCollection.updateOne(
            { _id: firebaseID },
            updateCommand
        );
        return this.getUserById(firebaseID);
    },

    async editProfilePic(id, url){
        let userCollection = await users();
        let updatedUser = {
                profilePhotoUrl: url
        };
        let updateCommand = {
            $set: updatedUser
        };

        let editedUser = await userCollection.updateOne({ _id: id }, updateCommand)
        return this.getUserById(id);
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
