const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const methodOverride = require('method-override');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const chats = require('./routes/api/chats');


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config

const mongoURI = require('./config/keys').mongoURI;
const publicPath = path.join(__dirname, '../public');

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/chats', chats);




// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

var server = http.createServer(app);
var io = socketIO(server);
app.set('io', io);
// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  app.set('socket', socket);
  console.log('connect');

  // just like on the client side, we have a socket.on method that takes a callback function
    socket.on('addMessage', (message) => {
    
      console.log('chat id'+message.chat);
      var chatID = message.chat;
      var call = 'addMessage'+chatID;
      io.sockets.emit(call, message);
    });
    
    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
      console.log('user disconnected')
    });

 });


const port = process.env.PORT || 5000;



//Changed from app.listen to server.listen to enable socket messaging

server.listen(port, () => console.log(`Server running on port ${port}`));
