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
    constructor(props){
        super(props);
        this.formSubmit=this.formSubmit.bind(this)
        this.state={
            uid: undefined
        };
    }
    formSubmit(e) {
        e.preventDefault();
        firebase.auth().signOut()
        const email = e.target.elements.email.value
        const password = e.target.elements.password.value
        let user
        user= auth.signInWithEmailAndPassword(email, password).catch(function (e) {
            console.log(e.code)
            switch (e.code) {
                case "auth/user-not-found":
                    user=auth.createUserWithEmailAndPassword(email,password)
                    break;
                default:
                    break;
            }
        })
        firebase.auth().onAuthStateChanged((firebaseuser)=>{
            if (firebaseuser){
                this.setState(()=>{
                    return {
                        uid: firebaseuser.uid
                    }
                },function(){
                    console.log(`STATE: ${this.state.uid}`)
                })
            }else{
                console.log ("nada")
            }
        })
    }
    
    render() {
        return (
            <div >
                <form onSubmit={this.formSubmit}>
                    <input type="email" id="email" placeholder="Email Address" required />
                    <input type="password" id="password" placeholder="Password" required/>
                    <br /><br />
                    <button id="loginsignup" onClick={this.signon} className="btn btn-primary">Login/Sign Up </button>



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