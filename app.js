const express = require('express');
const hostname = '127.0.0.1';
const port = 3000;
const books = require('./books');

const app = express();

app.use(express.json());
app.use('/api/books', books);

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

