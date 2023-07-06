const mongoose = require("mongoose");

const connectdb = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const connection = mongoose.connection;

    return connection;
};

module.exports = connectdb;
