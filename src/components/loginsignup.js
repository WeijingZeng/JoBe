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
        this.emailLogin = this.emailLogin.bind(this)
        this.emailSignUp = this.emailSignUp.bind(this)
        this.signOut=this.signOut.bind(this)
        this.state = {
            uid: undefined,
            email: undefined,
            lastSignInTime:undefined
        };
    }
    signOut(){
        auth.signOut();
        this.setState(()=>{
            return{
                loggedin: 0,
                email: undefined,
                uid: undefined,
                lastSignInTime: undefined,
                }
        }, function () {
            this.props.setUser(this.state)
        })
    }
    emailLogin() {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
       auth.signInWithEmailAndPassword(email, password).catch(function (e) {
            console.log(e.code)
            switch (e.code) {
                case "auth/user-not-found":
                    //user = auth.createUserWithEmailAndPassword(email, password)
                    break;
                //need to add in password error check
                default:
                    console.log(`Something else went wrong: ${e.code}`)
                    break;
            }
        })
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

    emailSignUp() {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        auth.createUserWithEmailAndPassword(email, password).catch(function (e) {
            console.log(e.code)
            //error code checks will go here
            // switch (e.code) {
            //     case "":
            //         user = auth.createUserWithEmailAndPassword(email, password)
            //         break;
            //     //need to add in password error check
            //     default:
            //         console.log(`Something else went wrong: ${e.code}`)
            //         break;
            //}
        })
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
                    console.log(firebase.auth().currentUser)
                    this.props.setUser(this.state)
                })

            }
        })
    }
    googleSignOn(googleUser) {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        //     var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        //         unsubscribe();
        //         // Check if we are already signed-in Firebase with the correct user.
        //         if (!this.isUserEqual(googleUser, firebaseUser)) {
        //             // Build Firebase credential with the Google ID token.
        //             var credential = firebase.auth.GoogleAuthProvider.credential(
        //                 googleUser.getAuthResponse().id_token);
        //             // Sign in with credential from the Google user.
        //             firebase.auth().signInWithCredential(credential).catch(function (error) {
        //                 // Handle Errors here.
        //                 var errorCode = error.code;
        //                 var errorMessage = error.message;
        //                 // The email of the user's account used.
        //                 var email = error.email;
        //                 // The firebase.auth.AuthCredential type that was used.
        //                 var credential = error.credential;
        //                 // ...
        //             });
        //         } else {
        //             console.log('User already signed-in Firebase.');
        //         }
        //     });
        // }
        // isUserEqual(googleUser, firebaseUser) {
        //     if (firebaseUser) {
        //         var providerData = firebaseUser.providerData;
        //         for (var i = 0; i < providerData.length; i++) {
        //             if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        //                 providerData[i].uid === googleUser.getBasicProfile().getId()) {
        //                 // We don't need to reauth the Firebase connection.
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
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
                    <br/>
                    <button onClick={this.signOut} id="login" className="btn btn-primary">Log Out</button>
                </div>
            )
        } else {
            return (
                <div >
                    <input type="email" id="email" placeholder="Email Address" required />
                    <input type="password" id="password" placeholder="Password" required />
                    <br /><br />
                    <button onClick={this.emailLogin} id="login" className="btn btn-primary">Login</button>
                    <button onClick={this.emailSignUp} id="signup" className="btn btn-primary">Sign Up</button>
                    <br /><br />
                    <br /><br />
                    Login with FaceBoook Placeholder.
            </div>
            )
        }
    }
}

export default LoginSignUp;