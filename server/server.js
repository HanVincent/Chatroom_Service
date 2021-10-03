const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { validateCommand, initGame, shuffleArray } = require('./utils/game');
const { Users } = require('./utils/users');

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
        if (!params.name || !params.room) {
            return callback('Name and room are required!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserNameList(params.room));

        // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the WhoIsSpy game. Please use "/whoisspy term1,term2,_ num1,num2,num3"'));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatroom with WhoIsSpy game.'));
        socket.emit('newMessage', generateMessage('Admin', 'Considering security concern, I only show the chatroom prototype.'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} join`));

        callback();
    });

    // Comment the codes in case of security.
    socket.on('createMessage', (message, callback) => {
        // const user = users.getUser(socket.id);

        // if (user && isRealString(message.text)) {
        //     message.text = message.text.trim();

        //     // following code contains normal chatting and gaming process
        //     // TODO: should be refactored
        //     if (validateCommand(message.text)) {
        //         const players = users.getOtherUsers(user.room, user.id);
        //         const order = shuffleArray(players.map(player => player.name)).join(', ');
        //         try {
        //             const identities = initGame(message.text, players);
        //             for (const [term, group_players] of Object.entries(identities)) {
        //                 for (let user of group_players) {
        //                     io.to(user.id).emit('newMessage', generateMessage('Admin',
        //                         `${user.name} starts the game. Your term is "${term}" with speaking order: ${order}`));
        //                 }
        //             }
        //             io.to(user.id).emit('newMessage', generateMessage('Admin', 'Game is starting with speaking order: ' + order));

        //         } catch {
        //             io.to(user.room).emit('newMessage', generateMessage('Admin', 'Wrong command.'));
        //         }
        //     } else if (message.text.startsWith('/')) {
        //         io.to(user.room).emit('newMessage', generateMessage('Admin', 'Wrong command, please use /whoisspy'));
        //     } else {
        //         // normal chat
        //         io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        //     }
        // }

        // callback('This text is from server');
    });

    socket.on('createLocationMessage', (coords, callback) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserNameList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});