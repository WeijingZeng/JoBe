const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const chats = mongoCollections.chats;
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
    async addChat(id,chatId){
        try{
            const userCollection = await users();
            console.log("adding chat " +  chatId + "to user" + id);
            let response = await userCollection.updateOne({_id:id},{$push: {chats:chatId}});
            console.log("chat adding response " + response);
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getChats(id){
        try{
            const userCollection = await users();
            const chatCollection = await chats();
            try{
            let user = await userCollection.findOne({_id:id});
            console.log("this is the user " + JSON.stringify(user));
            let chats = []; 
            for(let i=0;i<user.chats.length;i++){
                try{
                    chats.push(await chatCollection.findOne({_id:user.chats[i]}));
                    //console.log(chats);
                }catch(e){
                    console.log(e);
                }
            };
            console.log("this is the type of these chats from user " + typeof chats);
            console.log("got these chats from user " + chats);
            //userCollection.remove({});
            //chatCollection.remove({});
            return chats; 
           }catch (e) {
                console.log(e)
                return {error: e};
            }
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
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
