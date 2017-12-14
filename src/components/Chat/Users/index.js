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
                        return <li key={uuid.v4()}><button type="button"  
                               value={user} 
                               onClick={e => {
                                    e.preventDefault();
                                    this.props.joinChat([this.props.username,e.target.value]);
                                }}>
                        {user}
                        </button></li>;
                    }else{
                       return <li key={uuid.v4()}>{user}(you)</li>
                    }
                });
    return (
        <div>
        <h1>users</h1>
            <ul>
                {UserList}
            </ul>
        </div>
    );
  };
}

export default Users;
