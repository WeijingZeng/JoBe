const userRoutes = require("./users");
const matchRoutes = require("./matches");
const photoRoutes = require("./photo");
const genreRoutes = require("./genres");
const chatRoutes = require("./chats");

const constructorMethod = (app) => {
    app.use("/chat", chatRoutes);
    app.use("/users", userRoutes);
    app.use("/matches", matchRoutes);
    app.use("/photo", photoRoutes);
    app.use("/genres", genreRoutes);
};

module.exports = constructorMethod;
