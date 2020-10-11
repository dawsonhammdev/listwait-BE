const express = require('express'); // import the express package

const server = require('./api/server');

const PORT = process.env.PORT ||5000;


// watch for connections on port 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});