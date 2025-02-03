const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here (Example)
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  });
// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
     let userswithsamename = users.filter((user) => {
       return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
// Check if the user with the given username and password exists
//const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    //let validusers = users.filter((user) => {
        //return (user.username === username && user.password === password);
    //});
    // Return true if any valid user is found, otherwise false
    //if (validusers.length > 0) {
        //return true;
    //} else {
        //return false;
    //}
//}


  
  // Get the book list available in the shop
  public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books));
  });
  // Asynchronous version
  public_users.get('/', async function (req, res) {
      try {
          const response = await axios.get("https://api.example.com/books");
          res.status(200).json({message: response.data});
      }
      catch(error) {
          console.error("Error fetching books: "+ error);
          res.status(500).json({errorMessage: "Error fetching books"});
      }
  }); 
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  const all_books = new Promise((resolve,reject)=>{

    if(books){
      // return res.status(300).json(books);
      resolve(books)
    }
    else
    {
      // return res.status(404).json({message: 'No list of the books found'})
      reject({error: 'No Book Library was found'})
    }
  })

  all_books.then((resp)=>{
    return res.status(200).json(resp);
  }).catch(err=>res.status(403).json({error: err}))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN = req.params.isbn

  const book_by_isbn = new Promise((resolve, reject)=>{

    let book = books[ISBN]
    if(book)
    {
      // res.status(200).json(book)
      resolve(book)
    }
    else{
      // res.status(404).json({message: `No Book is found for the ISBN: ${ISBN}`})
      reject({error: `No Book is found for the ISBN: ${ISBN}`})
    }
  })

  book_by_isbn.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let arr = Object.entries(books)
  const book_author = new Promise((resolve, reject)=>{

    let book_by_author = arr.filter((item)=>item[1].author === author)
    if(book_by_author)
    {
      resolve(book_by_author)
      // res.status(200).json(book_by_author[0][1])
    }
    else{
      // res.status(404).json({message: `No Book is found for the author: ${author}`})
      reject({message: `No Book is found for the author: ${author}`})
    }
  })

  book_author.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let arr = Object.entries(books)

  const book_title = new Promise((resolve,reject)=>{
    let book_by_title = arr.filter((item)=>item[1].title === title)
    if(book_by_title)
    {
      // res.status(200).json(book_by_title[0][1])
      resolve(book_by_title[0][1])
    }
    else{
      // res.status(404).json({message: `No Book is found for the title: ${title}`})
      reject({message: `No Book is found for the title: ${title}` })
    }
  })
  book_title.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let ISBN = req.params.isbn

  let book = books[ISBN]
  if(book)
  {
    res.status(200).json(book.reviews)
  }
  else{
    res.status(404).json({message: `No Book is found for the ISBN: ${ISBN}`})
  }
 
});

module.exports.general = public_users;
