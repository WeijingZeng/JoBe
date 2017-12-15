import React, { Component } from 'react';
const uuid = require('uuid')
class Users extends Component {
  constructor(props){
        super(props);
  };
  render() {
    console.log("users in the user component " + this.props.users); 
    console.log("uid in user component " + this.props.uid);
    let UserList = null;
    if(this.props.users.length >1){
        UserList = this.props.users.map( (user) =>{
                if(this.props.uid !== user._id){
                    return(<button
                            key={uuid.v4()}
                            value={user._id}
                            onClick={e => {this.props.joinChat([this.props.uid,e.target.value._id])}}>
                                {user.email}
                            </button>);
                }
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
