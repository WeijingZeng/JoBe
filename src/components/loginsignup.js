import React, { Component } from 'react';
const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyCbb4SNcbrKwQsSxegT7A9TjsjG7jkYGBs",
    authDomain: "jobe-b84fc.firebaseapp.com",
    databaseURL: "https://jobe-b84fc.firebaseio.com",
    storageBucket: "jobe-b84fc.appspot.com",
    projectId: "jobe-b84fc",
    messagingSenderId: "447681007576",
};
firebase.initializeApp(config);
const auth = firebase.auth();

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
    async signOut() {
        await auth.signOut();
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
    async emailLogin(loginOrSignUp) {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        if (loginOrSignUp === "login") {
            await auth.signInWithEmailAndPassword(email, password)
                .catch((e) => {
                    console.log(e.code)
                    switch (e.code) {
                        case "auth/user-not-found":
                            this.setState({ loginError: "No Account With That Email Address Found!" })
                            break;
                        case "auth/wrong-password":
                            this.setState({ loginError: "Password Incorrect!" })
                            break;
                        case "auth/invalid-email":
                            this.setState({ loginError: "Invalid Email Address!" })
                            break;
                        default:
                            console.log(`Something else went wrong: ${e.code}`)
                            this.setState({ loginError: "Unkown Error!" })
                            break;
                    }
                });
        } else if (loginOrSignUp === "signup") {
            await auth.createUserWithEmailAndPassword(email, password).catch((e) => {
                console.log(e.code)
                switch (e.code) {
                    case "auth/invalid-email":
                        this.setState({ loginError: "Invalid Email Address!" })
                        break;
                    case "auth/weak-password":
                        this.setState({ loginError: "Password Blank or Password Less Than 6 Characters!" })
                        break;
                    case "auth/email-already-in-use":
                        this.setState({ loginError: "Email Address Already in Use!" })
                        break;
                    default:
                        console.log(`Something else went wrong: ${e.code}`)
                        this.setState({ loginError: "Unkown Error!" })
                        break;
                }
            });
        }
        await auth.onAuthStateChanged((firebaseuser) => {
            if (firebaseuser) {
                this.setState(() => {
                    return {
                        email: firebaseuser.email,
                        uid: firebaseuser.uid,
                        lastSignInTime: firebaseuser.metadata.lastSignInTime,
                        loggedin: 1
                    }
                }, function () {
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
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // The email of the user's account used.
            //var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            //var credential = error.credential;
        }
        await auth.onAuthStateChanged((firebaseuser) => {
            if (firebaseuser) {
                this.setState(() => {
                    return {
                        email: firebaseuser.email,
                        uid: firebaseuser.uid,
                        lastSignInTime: firebaseuser.metadata.lastSignInTime,
                        loggedin: 1
                    }
                }, function () {
                    this.props.setUser(this.state)
                })
            }
        })
    }
    render() {
        if (this.state.loggedin === 1) {
            return (
                <div >
                    After Logging in, either the profile form for them to fill out their profile will
                    be displayed if they are a new user, or if they are not a new user, then render
                    their "homepage"
                    <br/>
                    <br/>
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
                    <img onClick={() => this.socialSignOn("google")} alt="google signin" src="./imgs/btn_google_signin.png" />
                    <br />
                    <img onClick={() => this.socialSignOn("facebook")} alt="facebook signin" src="./imgs/facebook_signin.png" />
                </div>
            )
        }
    }
}
export default LoginSignUp;