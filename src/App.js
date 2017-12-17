import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from "react-router-dom";
import { auth, isAuthenticated } from "./config/firebase-auth";

import LoginSignUp from "./components/loginsignup";
import Profile from "./components/profile";
import ProfileForm from "./components/profileform";
import Matches from "./components/matches";
import Chat from "./components/Chat"; 
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
        let footer = null;
        let profile = `/profile/${this.state.user.uid}`;

        var navItems = [
            {
                title: "Home",
                to: "/",
                mustBeLoggedIn: false
            },
            {
                title: "Chat",
                to: "/Chat",
                mustBeLoggedIn: true
            },
            {
                title: "Matches",
                to: "/matches",
                mustBeLoggedIn: true
            },
            {
                title: "Connections",
                to: "/connections",
                mustBeLoggedIn: true
            },
            {
                title: "Profile",
                to: profile,
                mustBeLoggedIn: true
            },
            {
                title: "Edit Profile",
                to: "/editprofile",
                mustBeLoggedIn: true
            }
        ];

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
                                <Link className="navbar-brand" to="/">
                                    JoBe
                                </Link>
                                {navItems.map((item) => {
                                    return (this.state.user.loggedin || !item.mustBeLoggedIn)
                                        ? (<li className="nav-item" key={item.to}><Link className="nav-link" to={item.to}>{item.title}</Link></li>)
                                        : null;
                                })}
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
        );

        if (isAuthenticated()) {           
            footer = (
                <footer className="footer navbar-fixed-bottom ">
                <div className="container">
                    <hr/>
                    <br />
                    You are logged in as UserID: {this.state.user.uid}
                    <br />
                    You are logge with Email: {this.state.user.email}
                    <br />
                    Your Last Login Was: {this.state.user.lastSignInTime}
                    <br />
                    <button onClick={() => auth.signOut()} id="login" className="btn btn-danger btn-sm">Log Out</button>
                </div>
                </footer>
            );
        }
        body=(
            <div>
                <Switch>
                    <PrivateRoute path="/editprofile" user={this.state.user} component={ProfileForm}/>
                    <PrivateRoute path="/matches" user={this.state.user} component={Matches}/>
                    <PrivateRoute path="/connections" user={this.state.user} component={Connections}/>
                    <PrivateRoute path="/profile/:id" component={Profile}/>
                    <PrivateRoute path="/profile" user={this.state.user} component={Profile}/>
                    <PrivateRoute path="/Chat" uid={this.state.user.uid} email={this.state.user.email} lastSignInTime={this.state.user.lastSignInTime} component={Chat}/>
                    /*<PrivateRoute path="/Chat" render={()=>{ 
                        return (
                            <Chat uid={this.state.user.uid} email={this.state.user.email} lastSignInTime={this.state.user.lastSignInTime}/>
                        )}} />*/
                    <Route path="/login" component={LoginSignUp}/>
                    <Redirect from={'*'} to={'/matches'}/>
                </Switch>
            </div>
        );
        return (
            <Router>
                <div className="App">
                    {header}
                    {body}
                    {footer}
                </div>
                
            </Router>
        );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isAuthenticated() === true
        ? <Component {...props} {...rest}/>
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  )

export default App;