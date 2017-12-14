import React, { Component } from 'react';
const uuid = require('uuid')
class Users extends Component {
  constructor(props){
        super(props);
  };
  render() {
    console.log("users in the user component " + this.props.users); 
    console.log("username in user component " + this.props.username);
   let UserList = this.props.users.map( (user) =>
                    {
                    if(user !== this.props.username){
                        return < button type="button"  
                               key={uuid.v4()}
                               value={user} 
                               onClick={e => {
                                    e.preventDefault();
                                    this.props.joinChat([this.props.username,e.target.value]);
                                }}>
                        {user}
                        </button>;
                    }
                });
    return (
        <div id="userBox">
        <h1 id="userTitle">users</h1>
        {UserList}
        </div>
    );
  };
}

export default Users;
