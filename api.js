const express = require("express");

const configAPIRoutes = require("./api/");

const app = express();
app.use(express.json());
configAPIRoutes(app);

app.listen(4000, () => {  
    console.log("API server is running on http://localhost:4000");
});