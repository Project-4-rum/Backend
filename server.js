DATABASE_URL = 'mongodb://127.0.0.1:27018'

const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(DATABASE_URL, {useNewUrlParser : true});
const db = mongoose.connection;

db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log("Connected to local database"));

const userRouters = require("./routes/users");
app.use('/users', userRouters);

app.listen(3000, () => console.log('Server started'));
