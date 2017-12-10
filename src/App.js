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
    if (this.state.user.loggedin===1) {
      //the user is logged in, render the home component
      // we probably want to pass the user object to the home component
      body =
        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to JoBe - A Place where Musicians Connect</h1>
            </header>
            <p className="App-intro">
              Here the home component would render.
            </p>
            <br /><br />
            {/* <Home /> */}
            <Switch>

            </Switch>
          </div>
        </Router>
    } else {
      //If the user is not logged in, render the login
      body =
        <Router>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to JoBe - A Place where Musicians Connect</h1>
            </header>
            <p className="App-intro">
              To get started, either login or sign up below
        </p>
            <br /><br />
            <LoginSignUp setUser={this.setUser} />
            <Switch>

            </Switch>
          </div>
        </Router>
    }
    return body;
  }
}

export default App;
