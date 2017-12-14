import React, { Component } from 'react';
import Submit from "./Submit";
import Log from "./Log";
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
            joinedChats: {}
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.joinChat = this.joinChat.bind(this);
        
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
            let userIds = allUsers.data.map( (user) => {return user._id});
            console.log("these are all the users:"+userIds);
            this.setState({users:userIds});
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
    if(this.state.users.includes(uid)){
        return;
    }
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
        <div className="chatBox row">
            <div className="col-3">
            <Users users={this.state.users} joinChat={this.joinChat} username={this.props.uid}/>
            </div>
            <div className="col-9">
            {log}
            {submit}
            </div>
        </div>
    );
  }
};

export default Chat;
