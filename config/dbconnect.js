const mongoose = require('mongoose');

const dbConnect = () => {
    // Connect DataBase
    mongoose
        .connect(
            process.env.MONGO_URL,
        )
        .then(() => console.log("DB is connected"))
        .catch((err) => console.log(err));
}

module.exports = dbConnect;