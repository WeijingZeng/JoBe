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
        this.formSubmit = this.formSubmit.bind(this)
        this.state = {
            uid: undefined
        };
    }
    formSubmit(e) {
        e.preventDefault();
        //first signout any signed in user
        firebase.auth().signOut()
        this.setState(() => {
            return {
                loggedin: 0
            }
        },function(){
            console.log(`STATE LOGGEDIN: ${this.state.loggedin}`)
        })
        
        const email = e.target.elements.email.value
        const password = e.target.elements.password.value
        //Try signing in, if user is not found then create the user
        let user
        user = auth.signInWithEmailAndPassword(email, password).catch(function (e) {
            console.log(e.code)
            switch (e.code) {
                case "auth/user-not-found":
                    user = auth.createUserWithEmailAndPassword(email, password)
                    break;
                //need to add in password error check
                default:
                    console.log(`Something else went wrong: ${e.code}`)
                    break;
            }
        })
        firebase.auth().onAuthStateChanged((firebaseuser) => {
            if (firebaseuser) {
                this.setState(() => {
                    return {
                        email: firebaseuser.email,
                        uid: firebaseuser.uid,
                        lastSignInTime: firebaseuser.metadata.lastSignInTime,
                        loggedin: 1
                    }
                }, function () {
                    console.log(`STATE LAST LOGIN: ${this.state.lastSignInTime}`)
                    console.log(`STATE UID: ${this.state.uid}`)
                    console.log(`STATE EMAIL: ${this.state.email}`)
                    console.log(`STATE LOGGEDIN: ${this.state.loggedin}`)
                    console.log("FIREBASE CURRENT USER:")
                    console.log(firebase.auth().currentUser)
                })
                this.props.setUser(this.state)
            } else {
                console.log("No user")
            }
        })
    }

    render() {
        return (
            <div >
                <form onSubmit={this.formSubmit}>
                    <input type="email" id="email" placeholder="Email Address" required />
                    <input type="password" id="password" placeholder="Password" required />
                    <br /><br />
                    <button id="loginsignup" className="btn btn-primary">Login/Sign Up </button>



                    <br /><br />
                    Login with Google Placeholder.
                <br /><br />
                    Login with FaceBoook Placeholder.
                </form>
            </div>
        )
    }
}

export default LoginSignUp;