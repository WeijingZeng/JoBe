const userRoutes = require("./users");
const matchRoutes = require("./matches");

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/matches", matchRoutes);
};

module.exports = constructorMethod;