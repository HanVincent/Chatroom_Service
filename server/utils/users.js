class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        const user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getOtherUsers(room, itself) {
        return this.users.filter(user => user.room === room).filter(user => user.id !== itself);
    }
    getUserList(room) {
        const users = this.users.filter((user) => user.room === room);
        return users;
    }
    getUserNameList(room) {
        const userNames = this.getUserList(room).map((user) => user.name);
        return userNames;
    }
}

module.exports = { Users };