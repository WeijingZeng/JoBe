const firebase = require("firebase");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jobe-b84fc.firebaseio.com"
});
const config = {
    apiKey: "AIzaSyCbb4SNcbrKwQsSxegT7A9TjsjG7jkYGBs",
    authDomain: "jobe-b84fc.firebaseapp.com",
    databaseURL: "https://jobe-b84fc.firebaseio.com",
    storageBucket: "jobe-b84fc.appspot.com",
    projectId: "jobe-b84fc",
    messagingSenderId: "447681007576"
};
const firebaseApp = firebase.initializeApp(config);

module.exports = {
    auth: firebaseApp.auth(),
    isAuthenticated: () => {
        return !!auth.currentUser;
    },
    fetch: async function (email){
        let user=await admin.auth().getUserByEmail(email)
        return user;
    }
}
