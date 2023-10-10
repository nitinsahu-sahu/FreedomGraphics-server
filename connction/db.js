const mongoose = require('mongoose');
require('dotenv').config()

// mongo connection
const DB = process.env.MONGO_CONN_URL;
try {
    mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
        console.log(`connection successful`);
    })
} catch (error) {
    console.log(`no connection`, err.message)
}
