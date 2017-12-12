import firebase from "firebase";
const config = {
    apiKey: "AIzaSyCbb4SNcbrKwQsSxegT7A9TjsjG7jkYGBs",
    authDomain: "jobe-b84fc.firebaseapp.com",
    databaseURL: "https://jobe-b84fc.firebaseio.com",
    storageBucket: "jobe-b84fc.appspot.com",
    projectId: "jobe-b84fc",
    messagingSenderId: "447681007576"
};
const firebaseApp = firebase.initializeApp(config);

export const auth = firebaseApp.auth();
export const isAuthenticated = () => {
    return !!auth.currentUser;
};
