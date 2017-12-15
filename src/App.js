import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Profile from "./components/profile";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { auth } from "./config/firebase-auth";

import LoginSignUp from "./components/loginsignup";
import Matches from "./components/matches";

class App extends Component {
    constructor(props) {
        super(props);
        this.setUser = this.setUser.bind(this);
    }
    handleAuthStateChanged(firebaseuser, self) {
        console.log("Auth state changed");
        let user = {
            loggedin: 0,
            email: undefined,
            uid: undefined,
            lastSignInTime: undefined,
            loginError: undefined
        };
        if (firebaseuser) {
            user = {
                email: firebaseuser.email,
                uid: firebaseuser.uid,
                lastSignInTime: firebaseuser.metadata.lastSignInTime,
                loggedin: 1
            };
        }
        self.setUser(user);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user =>
            this.handleAuthStateChanged(user, this)
        );
    }
    setUser(user) {
        this.setState(
            () => {
                return {
                    user: {
                        email: user.email,
                        uid: user.uid,
                        lastSignInTime: user.lastSignInTime,
                        loggedin: user.loggedin
                    }
                };
            },
            function() {
                console.log(
                    `APP STATE: ${this.state.user.email}, ${
                        this.state.user.uid
                    } ${this.state.user.lastSignInTime}, ${
                        this.state.user.loggedin
                    }`
                );
            }
        );
    }

    render() {
        let body = null;
        console.log(this.state);

        //If the user is not logged in, render the login
        let header = (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">
                        Welcome to JoBe - A Place where Musicians Connect
                    </h1>
                </header>
            </div>
        );

        if (this.state && this.state.user && this.state.user.loggedin === 1) {
            body = (
                <Router>
                    <div >
                        <Switch>

                            
                            <Route exact path="/profile" component={() => (<Profile user={this.state.user} />)}/>

                            <Route exact path="/matches" render={(props)=><Matches{...props} user={this.state.user}  />}/>

                        </Switch>
                        <br />
                        You are logged in as UserID: {this.state.user.uid}
                        <br />
                        You are logge with Email: {this.state.user.email}
                        <br />
                        Your Last Login Was: {this.state.user.lastSignInTime}
                        <br />
                        <button
                            onClick={() => auth.signOut()}
                            id="login"
                            className="btn btn-primary"
                        >
                            Log Out
                        </button>
                    </div>
                </Router>
            );
        } else {
            body = <LoginSignUp setUser={this.setUser} />;
        }

        return (
            <div className="App">
                {header}
                {body}
            </div>
        );
    }
}

export default App;
