const express = require("express");
const colors = require("colors");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema")
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development"
}))


mongoose.connect(process.env.URI + "graphqlDb")
    .then(() => {
        console.log("mongoDb connected".cyan.underline.bold);
    })

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})