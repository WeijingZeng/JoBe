const express = require("express");
const app = express();
const configAPIRoutes = require("./api/index");


console.log("config routes api.js "+JSON.stringify(configAPIRoutes));
app.use(express.urlencoded());
app.use(express.json());
configAPIRoutes(app);

app.listen(4000, () => {  
    console.log("API server is running on http://localhost:4000");
});
