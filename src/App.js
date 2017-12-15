import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { auth } from "./config/firebase-auth";

import LoginSignUp from "./components/loginsignup";
import Profile from "./components/profile";
import ProfileForm from "./components/profileform";
import Matches from "./components/matches";
import Connections from "./components/connections";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                loggedin: 0,
                email: undefined,
                uid: undefined,
                lastSignInTime: undefined,
                loginError: undefined
            }
        };
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
        let profile = `/profile/${this.state.user.uid}`;
        //If the user is not logged in, render the login
        let header = (
            <div>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">
                        Welcome to JoBe - A Place where Musicians Connect
                    </h1>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div
                            className="collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <ul className="navbar-nav mx-auto">
                                <a className="navbar-brand" href="/">
                                    JoBe
                                </a>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Home
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={profile}>
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/matches">
                                        Matches
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/connections">
                                        Connections
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
        );

        if (this.state && this.state.user && this.state.user.loggedin === 1) {
            body = (
                <div>
                    <Switch>
                        <Route exact path="/profile" component={() => (<Profile user={this.state.user} />)} />
                        <Route exact path="/profileform" component={() => (<ProfileForm user={this.state.user} />)} />
                        <Route
                            exact
                            path="/matches"
                            render={renderProps => (
                                <Matches
                                    {...renderProps}
                                    user={this.state.user}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/connections"
                            render={renderProps => (
                                <Connections
                                    {...renderProps}
                                    user={this.state.user}
                                />
                            )}
                        />
                        <Route path="/profile/:id" component={Profile} />
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
            );
        } else {
            body = <LoginSignUp setUser={this.setUser} />;
        }

        return (
            <Router>
                <div className="App">
                    {header}
                    {body}
                </div>
            </Router>
        );
    }
}

export default App;
