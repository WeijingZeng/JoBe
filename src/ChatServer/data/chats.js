const mongoCollections = require("../config/mongoCollections");
const chats = mongoCollections.chats;
const uuid = require("node-uuid");

let exportedMethods = {
    async getAllUsers() {
        const chatCollection = await chats();
        const allChats = await chatCollection.find({}).toArray();
        return allChats;
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
        try{
            const chatCollection = await chats();
            let response = await chatCollection.insertOne(chat);
            return response; 
            
        } catch (e) {
            console.log("there was an error");
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
