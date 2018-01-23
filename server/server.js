const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));


io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join', (params, callback) => {
        if(!params.name || !params.room) {
            return callback('Name and room are required!');
        }

        socket.join(params.room);
        // socket.leave('The office');
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // io.emit -> io.to('The office').emit
        // socket.broadcast.emit -> socket.broadcast.to('The office').emit
        // socket.emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} join`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // send message to all except itself
        // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This text is from server');        
    });

    socket.on('createLocationMessage', (coords, callback) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});