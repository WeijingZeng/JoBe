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
    return (
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
    );
  }
}

export default App;
