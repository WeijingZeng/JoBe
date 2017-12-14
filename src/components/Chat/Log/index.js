import React, { Component } from 'react';
const uuid = require('uuid')
class Log extends Component {
  constructor(props){
        super(props);
  };
  render() {
       let chatList = this.props.messages.map(message => <li key={uuid.v4()}><p>{message.username}</p><p>{message.message}</p></li>);
    return (
        <div>
        <h1>{this.props.roomTitle}</h1>
       <ul>
        {chatList}
       </ul>
        </div>
    );
  };
}

export default Log;
