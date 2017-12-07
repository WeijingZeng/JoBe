import React, { Component } from 'react';
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyCbb4SNcbrKwQsSxegT7A9TjsjG7jkYGBs",
    authDomain: "jobe-b84fc.firebaseapp.com",
    databaseURL: "https://jobe-b84fc.firebaseio.com",
    storageBucket: "jobe-b84fc.appspot.com",
    projectId: "jobe-b84fc",
    messagingSenderId: "447681007576",
};
firebase.initializeApp(config);
var auth = firebase.auth();

class LoginSignUp extends Component {
    constructor(props) {
        super(props);
        console.log(auth.currentUser)
        this.emailLogin = this.emailLogin.bind(this);
        this.socialSignOn = this.socialSignOn.bind(this)
        this.signOut = this.signOut.bind(this)
        this.state = {
            uid: undefined,
            email: undefined,
            lastSignInTime: undefined,
            loginError: undefined
        };
    }
    signOut() {
        auth.signOut();
        this.setState(() => {
            return {
                loggedin: 0,
                email: undefined,
                uid: undefined,
                lastSignInTime: undefined,
                loginError: undefined
            }
        }, function () {
            this.props.setUser(this.state)
        })
    }
    emailLogin(loginOrSignUp) {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        if (loginOrSignUp === "login") {

            auth.signInWithEmailAndPassword(email, password)
                .catch((e) => {
                    console.log(e.code)
                    switch (e.code) {
                        case "auth/user-not-found":
                            this.setState({ loginError: "No Account With That Email Address Found!" })
                            break;
                        case "auth/wrong-password":
                            console.log("HIT WRONG PASS")
                            this.setState({ loginError: "Password Incorrect!" })
                            break;
                        default:
                            console.log(`Something else went wrong: ${e.code}`)
                            this.setState({ loginError: "Unkown  Error!" })
                            break;
                    }
                });
        } else if (loginOrSignUp === "signup") {
            auth.createUserWithEmailAndPassword(email, password).catch((e) => {
                console.log(e.code)
                switch (e.code) {
                    case "auth/invalid-email":
                        this.setState({ loginError: "Invalid Email Address!" })
                        break;
                    default:
                        console.log(`Something else went wrong: ${e.code}`)
                        this.setState({ loginError: "Unkown  Error!" })
                        break;
                }
            });
        }
        auth.onAuthStateChanged((firebaseuser) => {
            if (firebaseuser) {
                this.setState(() => {
                    return {
                        email: firebaseuser.email,
                        uid: firebaseuser.uid,
                        lastSignInTime: firebaseuser.metadata.lastSignInTime,
                        loggedin: 1
                    }
                }, function () {
                    console.log(auth.currentUser)
                    this.props.setUser(this.state)
                })

            }
        })
    }

    async socialSignOn(socialProvider) {
        let provider = null
        if (socialProvider === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (socialProvider === "facebook") {
            provider = new firebase.auth.FacebookAuthProvider();
        }
        try {
            let result = await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        }
        auth.onAuthStateChanged((firebaseuser) => {
            if (firebaseuser) {
                this.setState(() => {
                    return {
                        email: firebaseuser.email,
                        uid: firebaseuser.uid,
                        lastSignInTime: firebaseuser.metadata.lastSignInTime,
                        loggedin: 1
                    }
                }, function () {
                    console.log(auth.currentUser)
                    this.props.setUser(this.state)
                })

            }
        })
    }
    render() {
        if (this.state.loggedin === 1) {
            return (
                <div >
                    You are logged in as UserID: {this.state.uid}
                    <br />
                    You are logged with Email: {this.state.email}
                    <br />
                    Your Last Login Was: {this.state.lastSignInTime}
                    <br />
                    <button onClick={this.signOut} id="login" className="btn btn-primary">Log Out</button>
                </div>
            )
        } else {
            return (
                <div >
                    {this.state.loginError && <div className="loginerror">{this.state.loginError}</div>}
                    <input type="email" id="email" placeholder="Email Address" required />
                    <input type="password" id="password" placeholder="Password" required />
                    <br /><br />
                    <button onClick={() => this.emailLogin("login")} id="login" className="btn btn-primary">Login</button>
                    <button onClick={() => this.emailLogin("signup")} id="signup" className="btn btn-primary">Sign Up</button>
                    <br /><br />
                    <button onClick={() => this.socialSignOn("google")} id="google" className="btn"><img alt="google signin" src="./imgs/btn_google_signin.png" />
                    </button>
                    <br />
                    <button onClick={() => this.socialSignOn("facebook")} id="facebook" className="btn"><img alt="facebook signin" src="./imgs/facebook_signin.png" /></button>
                </div>
            )
        }
    }
}

export default LoginSignUp;