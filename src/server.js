require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const DATABASE_URL = 'mongodb://127.0.0.1:27018';
const PORT = 3000

mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to local database'));

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const fileRouter = require('./routes/files');

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/files', fileRouter);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
