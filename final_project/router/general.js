const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const Axios = require("axios")

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({message: "Bad Request"})
    }
    const user = users.find(u => u.username === username);
    if (user) {
        return res.status(400).json({message: "Already exists"})
    }
    users.push({"username": username, "password": password});
    return res.status(201).json({message:"User created successfully"})
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const booksList = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books), 1000);
        });
        res.send(JSON.stringify(booksList));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books[isbn]), 1000);
        });
        if (book) {
            res.send(JSON.stringify(book));
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksArray = Object.values(books);
        const filteredBooks = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(booksArray.filter(book => book.author === author)), 1000);
        });
        res.send(JSON.stringify(filteredBooks));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksArray = Object.values(books);
        const filteredBooks = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(booksArray.filter(book => book.title === title)), 1000);
        });
        res.send(JSON.stringify(filteredBooks));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews))
});

module.exports.general = public_users;
