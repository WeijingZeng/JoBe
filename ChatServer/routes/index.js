const userRoutes = require("./users");
const matchRoutes = require("./matches");
const photoRoutes = require("./photo");

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/matches", matchRoutes);
    app.use("/photo", photoRoutes);
    app.use("*", (req, res) => {
        res.status(404);
    });
};

module.exports = constructorMethod;
