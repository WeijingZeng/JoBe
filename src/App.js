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
        <br/><br/>
        <LoginSignUp/>
        <Switch>
        
    </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
