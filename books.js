const express = require('express');
const router = express.Router()
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db(process.env.MONOGODB_NAME);
const books = db.collection(process.env.MONOGODB_COLLECTION);

async function getBooks(id = null){
    try {

        if (id) {
            const query = { book_id: parseInt(id) };
            return await books.findOne(query);
        }

        return await books.find().toArray();
    } catch (error) {
        console.log(error);
    }
}

async function addBook(book) {
    try {
        let nextId;

        await getNextId().then(id => {
            nextId = id;
        });

        const doc = {
            book_id: nextId,
            title: book.title,
            author: book.author,
        };

        await books.insertOne(doc);
        return await books.find().toArray();

    } catch (error) {
        console.log(error);
    }
}

async function updateBook(id, book) {

    try {

        const filter = { book_id: parseInt(id) };

        const doc = {
            $set: {
                title: book.title,
                author: book.author,
            }
        };

        await books.updateOne(filter, doc);
        return await books.find().toArray();

    } catch (error) {
        console.log(error);
    }
}

async function deleteBook(id) {
    try {

        const filter = { book_id: parseInt(id) };

        await books.deleteOne(filter);
        return await books.find().toArray();

    } catch (error) {
        console.log(error);
    }
}

async function getNextId() {
    const book = await books.find().sort({book_id: -1}).limit(1).toArray();
    return book[0].book_id + 1;
}


// Get all books.
router.get('/', (req, res) => {
    getBooks().then(books => {
        res.json(books);
    });
});

// Get a specific book by ID.
router.get('/:id', (req, res) => {
    const id = req.params.id;
    getBooks(id).then(books => {
        res.json(books);
    });
});

// Add a book.
router.post('/', (req, res) => {
    const body = req.body;
    addBook(body).then(books => {
        res.json(books);
    });
});

// Update a book.
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    updateBook(id, body).then(book => {
        res.json(book);
    });
});

// Remove a book.
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    deleteBook(id).then(book => {
        res.json(book);
    });
});

module.exports = router;