import React, { Component } from 'react';
import Submit from "./Submit";
import Log from "./Log";

import ChatsPanel from "./ChatsPanel";
import Users from "./Users";
import io from 'socket.io-client';
import ApiHelper from "./apiHelper";



class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
            socket: io.connect('http://localhost:8000'),
            users: [],
            joinedChats: []
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.startChat = this.startChat.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
        
  }
  async componentDidMount(){
      //checks if the user is in the database and adds them if not, this is only for testing purposes
      try{
            let addedUser = await ApiHelper.post("/users",{firebaseId:this.props.uid , email:this.props.email,lastLogin:this.props.lastSignInTime})
            console.log(`my uid (should be the same as added users) ${this.props.uid}`);
            console.log(`added a user: ${JSON.stringify(addedUser.data)}\n\n\n\n\n\n\n\n\n\n`);
        }catch(e){
            console.log("\n\n\n\n\n\n coudln't add user");
            console.log(e);
        }
        //loads the other users in the website
        try{
            let allUsers = await ApiHelper.get("/users");
            this.setState({users:allUsers.data});
        }catch(e){
            console.log(e)
        }
        //loads all the chats of the user
        try{
            let allChats = await ApiHelper.get(`users/${this.props.uid}/chats`);
            console.log("\n\n\n\n\n\ngot the chats!!");
            console.log(allChats.data);
            this.setState({joinedChats:allChats.data});
            //have to join all of your chats!
            allChats.data.forEach(chat => {
                this.state.socket.emit("subscribe",chat._id);
            });
        }catch(e){

            console.log("ERROR getting chats");
            console.log(e)
        }
        //lets the chat server know that the user has logged in 
        this.state.socket.emit("login",this.props.uid);
        //receive a chat message, update messages
        this.state.socket.on("chatMessage", (message) => {
            this.updateMessages(message);
        });
        //when another user logs in update users
        this.state.socket.on("login", (uid) => {
            this.updateUsers(uid);
        });
        //join a specific chat 
        this.state.socket.on("subscribe", chat => {
            console.log(`I, ${this.props.uid} got the message to subscribe to ${JSON.stringify(chat)}`);
            console.log(`the chat i got from the chatserver is ${chat}`);    
            this.addChat(chat);
            this.setActiveChat(chat._id);
            this.state.socket.emit("subscribe",chat._id);
        });
  }
    ///////////methods to send and update messages/////////////
   async sendMessage(message){
    if(this.state.activeChat !== undefined){ 
        let data= {uid:this.props.uid,username:this.props.email,message:message,activeChat:this.state.joinedChats[this.state.activeChat]._id};
        this.state.socket.emit('chatMessage',data);
        try{    
           await ApiHelper.post(`/users/chat/${data.activeChat}/message`,data);
           console.log("posted message to db");
        }catch(e){
            console.log("error posting message to db" + e);
            console.log(e);
        }
        console.log('emitted message');
    }
  }
  async updateMessages(message){
    let temp=this.state.joinedChats;
    let chatIndex = this.getChatIndex(message.activeChat);
    console.log("added message to chat" + message.activeChat);
    console.log("chat log" + temp[chatIndex]);
    temp[chatIndex].chatLog = temp[chatIndex].chatLog.concat([message]);
    console.log("chat log after add" + temp[chatIndex]);
    console.log(temp);

    this.setState({joinedChats:temp});
    //send post request
  }
   /// methods to update the users that have logged in////
  updateUsers(uid){
    if(this.state.users.includes(uid)){
        return;
    }
    let temp=this.state.users.concat([uid]);
    this.setState({users:temp});
  }
  ////methods to add chats, and set which chat is currently active/////
  startChat(users){ //this method creates a new chat for users
    console.log(`\n\n\n\n\n\n\n =====starting chat with users===== \n${users} \n\\n\n\n\n`);
    this.state.socket.emit("startChat",users);
  } 
  setActiveChat(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id == id){
                    index = i;
                }
            }
            console.log("set active chat to " + index);              
            console.log("active chat is " + JSON.stringify(this.state.joinedChats[index]));
            this.setState({activeChat:index});
  }
    //helper method which checks for a chat by id, and returns its index in this.state.activeChats
  getChatIndex(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id == id){
                    index = i;
                }
            }
            return index;
  }
  async addChat(chat){
        //format
        //{id,users,chatLog}
        try{    
            let response = await ApiHelper.post(`/users/${this.props.uid}/chats`,{_id:chat._id,users:chat.users,chatLog:chat.chatLog});
            console.log(JSON.stringify(response)+"THIS IS MY RESPONSE HEAR IT LOUD AND CLEAR");
            if(!response.data.error){
                console.log("adding chat: " + JSON.stringify(chat));
                let temp = this.state.joinedChats;
                temp = temp.concat([chat]);
                console.log(`added chat ${chat._id} in the object ${JSON.stringify(temp)}`);
                this.setState({joinedChats:temp});
            }
        }catch(e){
            console.log(e);
        }
  }

    //renders the chat 
  render() {
    let submit = null;
    let log= null;
    console.log("\n\n\n\nthis is my joined chats "+this.state.joinedChats+"\n\n\n");
    if(this.state.activeChat != undefined){
        console.log("joined chats"+this.state.joinedChats[this.state.activeChat]);
        console.log("active chat messages"+this.state.joinedChats[this.state.activeChat]);
        log=<Log chatLog={this.state.joinedChats[this.state.activeChat].chatLog} roomTitle="chat" username={this.props.uid}/>
        submit= <Submit messages={this.state.messages} sendMessage={this.sendMessage}/>;
    }

    console.log("logged in?" +this.state.loggedIn);
    console.log("submit" + submit);
    return (
        <div className="chatBox row">
            <div className="col-3">
            <Users users={this.state.users} joinChat={this.startChat} uid={this.props.uid}/>
            </div>
            <div className="col-3">
            <ChatsPanel joinedChats={this.state.joinedChats} setActiveChat={this.setActiveChat} />
            </div>
            <div className="col-6">
            {log}
            {submit}
            </div>
        </div>
    );
  }
};

export default Chat;
