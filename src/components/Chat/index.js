import React, { Component } from 'react';
import Submit from "./Submit";
import Login from "./Login";
import Log from "./Log";
import Users from "./Users";
import io from 'socket.io-client';
import axios from "axios";


class Chat extends Component {
  constructor(props){
        super(props);
        //messages should be loaded from the database, so this state will probably have to be lifted up
        this.state = {
            socket: io.connect('http://localHost:8000'),
            users: [],
            joinedChats: {}
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.joinChat = this.joinChat.bind(this);
        
  }
  async componentDidMount(){
        console.log(this.props.uid);
        //get all users
        
        this.state.socket.emit("login",this.props.uid);
        this.state.socket.on("chatMessage", (message) => {
            this.updateMessages(message);
        });
        this.state.socket.on("login", (uid) => {
            this.updateUsers(uid);
        });
        this.state.socket.on("subscribe", channelId => {
            console.log(`I, ${this.props.uid} got the message to subscribe to ${channelId}`);
            this.addChat(channelId);
            this.setActiveChat(channelId);
            this.state.socket.emit("subscribe",channelId);
        });
  }
  sendMessage(message){
    if(this.state.activeChat){ 
        this.state.socket.emit('chatMessage',{username:this.props.uid,message:message,activeChat:this.state.activeChat});
        console.log('emitted message');
    }
  }
  updateMessages(message){
    let temp=this.state.joinedChats;
    console.log("added message to chat" + message.activeChat);
    console.log("chat log" + temp[message.activeChat]);
    temp[message.activeChat] = temp[message.activeChat].concat([message]);
    console.log("chat log after add" + temp[message.activeChat]);
    console.log(temp);
    this.setState({joinedChats:temp});
  }

  updateUsers(uid){
    let temp=this.state.users.concat([uid]);
    this.setState({users:temp});
  }

  joinChat(users){
    this.state.socket.emit("joinChat",users);
  } 
  setActiveChat(id){
            this.setState({activeChat:id});
  }
  addChat(id){
        let temp = this.state.joinedChats;
        temp[id] = [];
        console.log(`added chat ${id} in the object ${JSON.stringify(temp)}`)
        this.setState({joinedChats:temp});
  }
  render() {
    let submit = null;
    let users = null;
    let log= null;
    if(this.state.activeChat){
        console.log("joined chats"+this.state.joinedChats[this.state.activeChat]);
        console.log("active chat messages"+this.state.joinedChats[this.state.activeChat]);
        log=<Log messages={this.state.joinedChats[this.state.activeChat]} roomTitle="chat" username={this.props.uid}/>
        submit= <Submit messages={this.state.messages} sendMessage={this.sendMessage}/>;
    }
    console.log("logged in?" +this.state.loggedIn);
    console.log("submit" + submit);
    return (
        <div className="chatBox">
            <Users users={this.state.users} joinChat={this.joinChat} username={this.props.uid}/>;
            {log}
            {submit}
        </div>
    );
  }
};

export default Chat;
