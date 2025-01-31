const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean(test)
    return users.find(user => user.username === username && user.password === password);
}

const authenticatedUser = (username,password)=>{ //returns boolean(test)
    let usersList = Object.values(users);
    let user = usersList.find(b => b.username==username)
   if (user) {
     // check if the provided password matches the password in our records
     if (users.password === password) {
       // username and password match, return true
       return true;
     }
   }
   // username and/or password do not match, return false
   return false;
 }
 //only registered users can login
// regd_users.post("/login", (req,res) => {
   //const { username, password } = req.body;
 
   // Check if username or password is missing
   //if (!username || !password) {
//     return res.status(400).json({ message: 'Please provide a valid username and password' });
   //}
   //const user = users.find(u => u.username === username && u.password === password);
 
   // Check if username and password match
   //if (username === user.username && password === user.password) {
//     const accessToken = jwt.sign({ username, userPassword: password }, "secretKey", { expiresIn: '1h' });
 
     // Store the access token in the session
     //req.session.accessToken = accessToken;
 
     //return res.status(200).json({ message: 'Login successful',accessToken });
   //} else {
     //return res.status(401).json({ message: 'Invalid username or password' });
   //}
 //});

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here (Example)
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;
  
    let booksList = Object.values(books)
    const book = booksList.find(b => b.isbn == isbn)
    // If the ISBN doesn't exist in the books object, send an error message
    if (!book) {
      res.status(404).send('The book with ISBN ' + isbn + ' does not exist.');
      return;
    }
  
    // If the user already posted a review for this book, modify the existing review
    if (book.reviews[username]) {
      book.reviews[username] = review;
      //res.json('Your review has been updated for the book with ISBN ' + isbn + ':'+ `${book}`);
      res.json(`Your review has been updated for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);
  
      return;
    }
  
    // If the user didn't post a review for this book, add a new review
    book.reviews[username] = review;
    //res.send('Your review has been posted for the book with ISBN ' + isbn + ':'+ `${book}`);
    res.json(`Your review has been posted for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);
  
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
