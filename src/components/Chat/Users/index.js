import React, { Component } from 'react';
const uuid = require('uuid')
class Users extends Component {
  constructor(props){
        super(props);
  };
  render() {
    console.log("users in the user component " + this.props.users); 
    console.log("username in user component " + this.props.username);
    let UserList = null;
    if(this.props.users.length >1){
        UserList = this.props.users.map( (user) =>{
                    return(<button
                            key={uuid.v4()}
                            onClick={e => {this.props.joinChat([this.props.username,e.target.value])}}
                                    >
                            {user}
                            </button>);
        });
    }
    console.log("this is the UserList" + UserList);
    return (
        <div id="userBox">
           <h1>Users</h1> 
          {UserList} 
        </div>
    );
  };
}
export default Users;
