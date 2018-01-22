
const socket = io();

socket.on('connect', function () {
    console.log('connected to server');

    socket.emit('createMessage', {
        from: 'Andrew',
        text: 'Hello World',
    });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function(newMessage) {
    console.log('New Message', newMessage)
})