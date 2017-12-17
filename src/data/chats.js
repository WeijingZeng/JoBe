const mongoCollections = require("../config/mongoCollections");
const chats = mongoCollections.chats;
const uuid = require("node-uuid");
const userData = require("./users");

let exportedMethods = {
    async getAllChats() {
        try{
        const chatCollection = await chats();
        const allChats = await chatCollection.find({}).toArray();
        return allChats;
        }catch(e) {
            console.log(e);
        }
    },
    async getChatById(id) {
        const chatCollection = await chats();
        try {
            let chat = await chatCollection.findOne({ _id: id });
            return chat;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addChat(chat){
        //format is {_id,users,messages}
        let newchat = chat; 
        try{
            const chatCollection = await chats();
            //check to see if chat already exists
            let existingChat = await chatCollection.findOne({users:newchat.users});
            let existingChatId = await chatCollection.findOne({_id:newchat._id}) ;
            if(existingChat || existingChatId){
                console.log("\n\nERROR CHAT EXISTS\n\n");
                return({error:"chat aleady exists"});
            }
            newchat.users.forEach(async  (user) => {
               console.log("adding chat to user " + user);
               await userData.addChat(user,newchat._id);
            });
            let response = await chatCollection.insertOne(newchat);
            return response; 
            
        } catch (e) {
            console.log("there was an error " + e);
            console.log(e);
        }
    },
    async replaceChat(id,chat){
        try{
            const chatCollection = await chats();
            let response = await chatCollection.updateOne({_id:id},chat);
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addMessage(id,message){
        try{
            const chatCollection = await chats();
            let response = await chatCollection.updateOne({_id:id},{$push: {chatLog:message}});
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async removeChat(id) {
        const chatCollection = await chats();
        let response = chatCollection.removeOne({_id:id})
        try{
            if(response.deletedCount ==0){
                throw `could not find user with id of ${id}`;
            }
            return response;
        }catch (e){
            console.log("there was an error");
            console.log(e);
        }
    }
};

module.exports = exportedMethods;
