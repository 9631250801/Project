const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = 4250;
const swaggerDefinition = {
    info: {
        title: "Manish's Swagger....",
        version: "2.0.0",
        description: "Api's Docs....",
        contact: {
            name: "Manish....."
        },
    },
    servers: ["https://localhost:4200"],
    basePath: "/",
};
var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ["./routers/*.js"],
}
const swaggerDocs = swaggerJsdoc(options);
app.get("/swagger-json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
const userrouter = require("./routers/userRouter");
app.use("/user", userrouter);
const database = require("./connection/dbConnection");
app.listen(port, (error, result) => {
    if (error) {
        console.log(`Port "${port}" is not listening`);
    } else {
        console.log(`Port "${port}" is listening`);
    }
});