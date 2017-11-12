import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

import LoginSignUp from './components/loginsignup'
class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Switch>
        <Route path="/login" component={LoginSignUp} />
        <Route path="/signup" component={LoginSignUp} />
    </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
