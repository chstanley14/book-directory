const express = require('express');
const router = express.Router();
const books = require('./books.json');

// Get all books.
router.get('/', (req, res) => {
    res.json(books);
});

// Get a specific book by ID.
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.json(books.filter((book) => book.id === parseInt(id)));
});

// Add a book.
router.post('/', (req, res) => {
    const body = req.body;
    books.push(body);
    res.json(books);
});

// Update a book.
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    books.forEach((book, index) => {
        if (book.id === parseInt(id)) {
            books[index] = body;
        }
    });
    res.json(books);
});

// Remove a book.
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    books.forEach((book, index) => {
        if (book.id === parseInt(id)) {
            books.splice(index, 1);
        }
    });
    res.json(books);
});

module.exports = router;