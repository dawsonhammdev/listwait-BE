const bcrypt = require('bcryptjs');
const router = require('express').Router();
const secrets = require('../api/secrets')
const jwt = require('jsonwebtoken')
const authenticator = require("../middleware/authenticator")

const db = require("../database/dbConfig")

const Users = require('../models/user-model');
const { generateToken } = require("../middleware/generateToken");

// send a username, email and password and you will register a new user

router.post("/register", (req, res) => {
    let user = req.body;
    if (!user.username) {
        res.status(400).json({messsage: "Please include the username." })
      }
      if (!user.password) {
        res.status(400).json({messsage: "Please include the password." })
      }
      if (!user.email) {
        res.status(400).json({messsage: "Please include the phone number." })
      }
    if (user.username && user.password) {
      const hash = bcrypt.hashSync(user.password, 14);
      user.password = hash;
      
      Users.add(user)
        .then(user => {
          console.log(user)
          res.status(200).json({ message: "User registration successful.", id: user.id, username: user.username });
        })
        .catch(err => res.status(500).json({ errorMessage: "Error Registering User", err }))
    } else {
      res.status(400).json({ errorMessage: "Please include username, password and phone_number" });
    }
  });
  
// use the username and password set up in registration and you will log in using a token.

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ id: user.id, username: user.username, token: token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// change the username of the logged in user.

router.put("/user",userValidation,authenticator,(req,res)=>{
  const credentials = req.body;
  const {username} = jwt.verify(req.headers.authorization,secrets.jwtSecret);
  db("users").select("id").where({"username":username}).first().then((id)=>{
      credentials.password = bcrypt.hashSync(credentials.password, 8); //hash password
      db("users").update(credentials).where(id).then(data=>{
          data?res.status(201).json({message:"User updated succesfully"}):res.status(500).json({message:"User couldnt be updated"})
      }).catch(err=>{
          console.log(err);
          res.status(500).json({message:"Error updating user"});
      })
  })
})

function userValidation(req,res,next){
  if(!(req.body.username)||!(req.body.password)){
      res.status(403).send({message:"Please make sure to provide both username and password"});
  }
  next();
}


module.exports = router;