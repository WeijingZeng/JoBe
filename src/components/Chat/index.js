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
            //make sure to run the chatserver.js file! (node chatServer.js)
            socket: io.connect('http://localhost:8000'),
            users: [],
            joinedChats: []
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.startChat = this.startChat.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
        //this.joinChat = this.joinChat.bind(this);
        
  }
  async componentDidMount(){
      try{

            let addedUser = await ApiHelper.post("/users",{firebaseId:this.props.uid , email:this.props.email,lastLogin:this.props.lastSignInTime})
            console.log(`my uid (should be the same as added users) ${this.props.uid}`);
            console.log(`added a user: ${JSON.stringify(addedUser.data)}\n\n\n\n\n\n\n\n\n\n`);
        }catch(e){
            console.log("\n\n\n\n\n\n coudln't add user");
            console.log(e);
        }
        try{
            let allUsers = await ApiHelper.get("/users");
            this.setState({users:allUsers.data});
        }catch(e){
            console.log(e)
        }
        this.state.socket.emit("login",this.props.uid);
        this.state.socket.on("chatMessage", (message) => {
            this.updateMessages(message);
        });
        this.state.socket.on("login", (uid) => {
            this.updateUsers(uid);
        });
        this.state.socket.on("subscribe", chat => {
            console.log(`I, ${this.props.uid} got the message to subscribe to ${JSON.stringify(chat)}`);
            this.addChat(chat);
            this.setActiveChat(chat.id);
            this.state.socket.emit("subscribe",chat.id);
        });
  }
  sendMessage(message){
    if(this.state.activeChat){ 
        this.state.socket.emit('chatMessage',{uid:this.props.uid,username:this.props.email,message:message,activeChat:this.state.activeChat});
        console.log('emitted message');
    }
  }
  updateMessages(message){
    let temp=this.state.joinedChats;
    console.log("added message to chat" + message.activeChat);
    console.log("chat log" + temp[message.activeChat]);
    temp[message.activeChat].messages = temp[message.activeChat].messages.concat([message]);
    console.log("chat log after add" + temp[message.activeChat]);
    console.log(temp);
    this.setState({joinedChats:temp});
  }

  updateUsers(uid){
    if(this.state.users.includes(uid)){
        return;
    }
    let temp=this.state.users.concat([uid]);
    this.setState({users:temp});
  }

  startChat(users){ //this method creates a new chat for uers
    this.state.socket.emit("startChat",users);
  } 
  //joinChat(users,channelId){
  //}
  setActiveChat(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i].id == id){
                    index = i;
                }
            }
            console.log("set active chat to " + index);              
            this.setState({activeChat:index});
  }
  addChat(chat){
        //format
        //{id,users,chatLog}
        console.log("adding chat: " + JSON.stringify(chat));
        let temp = this.state.joinedChats;
        temp = temp.concat([chat]);
        console.log(`added chat ${chat.id} in the object ${JSON.stringify(temp)}`);
        this.setState({joinedChats:temp});
  }
  render() {
    let submit = null;
    let log= null;
    if(this.state.activeChat != undefined){
        console.log("joined chats"+this.state.joinedChats[this.state.activeChat]);
        console.log("active chat messages"+this.state.joinedChats[this.state.activeChat]);
        log=<Log messages={this.state.joinedChats[this.state.activeChat].messages} roomTitle="chat" username={this.props.uid}/>
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
