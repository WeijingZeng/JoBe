const express = require('express');
const router = express.Router();
const data = require("../src/data");
const chatData = data.chats;
//TODO make this less barebones, everything that is needed for the chat to function is here tho
//add new message
router.get("/", async (req, res) => {
    try{
   return await chatData.getAllChats(); 
    }catch (e){
        console.log(e);
        return({error: e});
    }
});
router.post("/:chatId/message", async (req, res) => {
    let message = req.body;
    console.log("tried to put a message in chat " + req.params.chatId );
    if (!message) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }
    try{
        let newChat =await chatData.addMessage(req.params.chatId,message);
        console.log("new message added! " + newChat);
        res.json(newChat);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
//add a new chat
router.post("/", async (req, res) => {
    let chat = req.body;
        
    console.log("this is req" + JSON.stringify(req.data));
    console.log("tried to put a chat in user " + req.params.id + "  that is " + JSON.stringify(chat ));
    if (!chat) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }

    try{
        let newChat =await chatData.addChat(chat);
        console.log("new chat added! " + JSON.stringify(newChat));
        res.status(200).json(newChat);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
module.exports = router;
