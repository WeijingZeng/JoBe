const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;


//firebaseID, username, firstName, lastName, email, gender, city, state, age, location, seeking,
//studioSWUsed, mainGenre, secondGenre, thirdGenre, hasSpace, bio, achivements, role, links, influences, lastLogin,
//profilePhotoUrl, localRemoteOrAll, distanceIfLocal
dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return users.addUser("8rpjbilwmlUOH3fnlKwBjjbSo9E2", "graffixnyc","Patrick","Hill", "graffixnyc@gmail.com","M",
    "Flushing","NY","42", "Long/Lat","band","Pro Tools","Rock", "Classic Rock","Hard Rock","Yes","Test Bio","none",
 "bassist","none","The Three Stooges","Sat, 09 Dec 2017 17:59:02 GMT","www.myphoto.com/me.jpg","Local","10");
    }).then(() => {
        console.log("Done seeding database");
        db.close();
    });
}, (error) => {
    console.error(error);
});
