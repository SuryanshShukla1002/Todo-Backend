const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MongoDBuri = process.env.MONGODB;

const setupTheDatabase = () => {
    mongoose
        .connect(MongoDBuri)
        .then(() => {
            console.log("Connection with database is successful");
        })
        .catch((error) => {
            console.log("Unable to connect with Database");
            console.error(error);
        });
};

module.exports = { setupTheDatabase };
