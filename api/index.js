const userRoutes = require("./users");
const matchRoutes = require("./matches");
const photoRoutes = require("./photo");

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/matches", matchRoutes);
    app.use("/photo", photoRoutes);
};

module.exports = constructorMethod;