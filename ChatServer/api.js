const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const configRoutes = require("./routes");
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
configRoutes(app);

app.listen(port, () => {
        console.log("We've now got a server!");
            console.log("Your routes will be running on http://localhost:"+port);

});
