import React, { Component } from 'react';
class Login extends Component {
  constructor(props){
        super(props);
        this.state = {
            username: ""
        };
  };
  changeUsername(username){
    this.setState({username});
  };
  render() {
    return (
        <div>
            <h1> Log in</h1>
            <form onSubmit= { e => {e.preventDefault();this.props.logIn(this.state.username)}}>
                <input type="text" placeholder="log in!" 
                       value={this.state.username} 
                       onChange={e => {
                            e.preventDefault();
                            this.changeUsername(e.target.value)
                        }}>
                </input>
                <button type="submit">Send</button>
            </form>
        </div>
    );
  };
}

export default Login;
