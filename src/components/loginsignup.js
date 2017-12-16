import React, { Component } from "react";
import firebase from "firebase";
import "../App.css";
import { auth } from "../config/firebase-auth";
import { test } from "../tasks/s3_upload_or_get";
import { Link } from "react-router-dom";

class LoginSignUp extends Component {
    constructor(props) {
        super(props);
        console.log(auth.currentUser);
        this.emailLogin = this.emailLogin.bind(this);
        this.socialSignOn = this.socialSignOn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.state = {
            uid: undefined,
            email: undefined,
            lastSignInTime: undefined,
            loginError: undefined,
            loggedin: 0
        };
    }

    async signOut() {
        await auth.signOut();
    }

    async emailLogin(loginOrSignUp) {
        const email = document.getElementById("email").value;
        console.log("email:" + email);
        const password = document.getElementById("password").value;
        console.log("psw:" + password);
        if (loginOrSignUp === "login") {
            await auth.signInWithEmailAndPassword(email, password).catch(e => {
                console.log(e.code);
                switch (e.code) {
                    case "auth/user-not-found":
                        this.setState({
                            loginError:
                                "No Account With That Email Address Found!"
                        });
                        break;
                    case "auth/wrong-password":
                        this.setState({ loginError: "Password Incorrect!" });
                        break;
                    case "auth/invalid-email":
                        this.setState({ loginError: "Invalid Email Address!" });
                        break;
                    default:
                        console.log(`Something else went wrong: ${e.code}`);
                        this.setState({ loginError: "Unkown Error!" });
                        break;
                }
            });
        } else if (loginOrSignUp === "signup") {
            await auth
                .createUserWithEmailAndPassword(email, password)
                .catch(e => {
                    console.log(e.code);
                    switch (e.code) {
                        case "auth/invalid-email":
                            this.setState({
                                loginError: "Invalid Email Address!"
                            });
                            break;
                        case "auth/weak-password":
                            this.setState({
                                loginError:
                                    "Password Blank or Password Less Than 6 Characters!"
                            });
                            break;
                        case "auth/email-already-in-use":
                            this.setState({
                                loginError: "Email Address Already in Use!"
                            });
                            break;
                        default:
                            console.log(`Something else went wrong: ${e.code}`);
                            this.setState({ loginError: "Unkown Error!" });
                            break;
                    }
                });
        }
    }
    async socialSignOn(socialProvider) {
        let provider = null;
        if (socialProvider === "google") {
            provider = new firebase.auth.GoogleAuthProvider();
        } else if (socialProvider === "facebook") {
            provider = new firebase.auth.FacebookAuthProvider();
        }
        try {
            var auth1 = await auth.signInWithPopup(provider);

            // profile picture of facebook profile
            if (auth1.additionalUserInfo.providerId === 'facebook.com') {
                test('https://graph.facebook.com/' + auth1.user.providerData[0].uid + '/picture?width=800', auth1.user.email + '.jpg')    // test function is in s3_upload_or_get file
            }

            // profile picture of google profile
            if (auth1.additionalUserInfo.providerId === 'google.com') {
                test(auth1.user.photoURL, auth1.user.email + '.jpg');
            }

        } catch (error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // The email of the user's account used.
            //var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            //var credential = error.credential;
            console.log(error);
        }
    }
    async forgotPassword() {
        const email = document.getElementById("email").value;
        if (!email){
            this.setState({
                loginError: "No Email Address Entered! Please Enter Your Email Address Below"
            });
        }else{
        try {
            await auth.sendPasswordResetEmail(email)
            this.setState({
                loginError: "Password Reset Email Sent!"
            });
        } catch (e) {
            console.log(e.code);
            switch (e.code) {
                case "auth/invalid-email":
                    this.setState({
                        loginError: "Invalid Email Address!"
                    });
                    break;
                case "auth/user-not-found":
                    this.setState({
                        loginError:
                            "No Account With That Email Address Found!"
                    });
                    break;
                default:
                    console.log(`Something else went wrong: ${e.code}`);
                    this.setState({ loginError: "Unkown Error!" });
                    break;
            }
        }
    }

    }

    render() {
        return (
            <div className="wrapper">
                <div className="login">
                    <p className="title">Welcome</p>
                    {this.state.loginError && (
                        <div className="loginerror">
                            {this.state.loginError}
                        </div>
                    )}
                    <input type="email" id="email" placeholder="Email Address" required />
                    <input type="password" id="password" placeholder="Password" required />

                    <Link to="#" onClick={this.forgotPassword}>Forgot Password</Link>
                    <br /><br />
                    <button onClick={() => this.emailLogin("login")} id="login" className="btn btn-primary">
                        Login
                </button>
                    <button onClick={() => this.emailLogin("signup")} id="signup" className="btn btn-primary">
                        Sign Up
                </button>
                    <br />
                    <br />
                    <img
                        onClick={() => this.socialSignOn("google")}
                        alt="google signin"
                        src="./imgs/btn_google_signin.png"
                    />
                    <img
                        onClick={() => this.socialSignOn("facebook")}
                        alt="facebook signin"
                        src="./imgs/facebook_signin.png"
                    />
                </div>
            </div>
        );
    }
}
export default LoginSignUp;
