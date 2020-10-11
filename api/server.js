const express = require('express');
const cors = require('cors');

const authRouter = require('../router/auth-router.js');
const restricted = require('../middleware/authenticator.js');

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);


server.get("/", (req, res) => {
    res.json({ message: "Server up and running" });
  });
  
  module.exports = server;