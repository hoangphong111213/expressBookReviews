const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    if (!username || !password) {
        return false;
    }
    let user = users.find(u => (u.username === username) && (u.password === password))
    if (!user) {
        return false
    }
    return true
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    req.session.username = username;
    let accessToken = jwt.sign({
        data: username
    },'access',{expiresIn:60*60})

    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    books[isbn].reviews[username] = review;

    return res.status(201).json({ message: "Review added or updated successfully" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for the user" });
    }
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
