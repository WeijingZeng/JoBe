import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import LoginSignUp from './components/loginsignup'
class App extends Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this)
  }
  setUser(user) {
    this.setState(() => {
      return {
        user: {
          email: user.email,
          uid: user.uid,
          lastSignInTime: user.lastSignInTime,
          loggedin: user.loggedin
        }
      }
    }, function () {
      console.log(`APP STATE: ${this.state.user.email}, ${this.state.user.uid} ${this.state.user.lastSignInTime}, ${this.state.user.loggedin}`)
    })
  }
  render() {
    let body = null;
    console.log (this.state)
    
      //If the user is not logged in, render the login
      body =
        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to JoBe - A Place where Musicians Connect</h1>
            </header>
            <p className="App-intro">
             Here is just our app container.  I have it rendering the LoginSignUp component because there are no other components
             done yet. We need to 
             think about what we want displayed on this page as this is the first page the user will be met with.  
             Maybe check the user state object,If it's populated, then we know the user is logged in and can render the logged 
             in "homepage" whatever we decide that
             will be.  If they are not logged in, then render the login component as shown below.
        </p>
            <br /><br />
            <LoginSignUp setUser={this.setUser} />
            <Switch>

            </Switch>
          </div>
        </Router>
    return body;
  }
}

export default App;
