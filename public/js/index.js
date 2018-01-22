
const socket = io();

socket.on('connect', function () {
    console.log('connected to server');

    // socket.emit('createMessage', {
    //     from: 'Andrew',
    //     text: 'Hello World',
    // }, function(data) {
    //     console.log('Got it', data);
    // });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New Message', message)
    const li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li)
})

$('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'Vincent',
        text: $('[name=message]').val()
    }, function() {

    })
})