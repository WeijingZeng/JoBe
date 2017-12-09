import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import Bands from './components/Bands';
import LoginSignUp from './components/LoginSignUp';
import Image from './styles/band.jpg'


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
            
            <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
              <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <a className="navbar-brand" href="/">Home</a>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/bands">Bands</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link disabled" href="#">something else</a>
                  </li>
                </ul>
              </div>
            </nav>
          </p>
          <br /><br />
          
          <Switch>
            
            <Route path='/bands' component={Bands}/>
            <Route path='/login' component={LoginSignUp} setUser={this.setUser}/>
          </Switch>
        </div>
      </Router>
    );
  }
}



export default App;
