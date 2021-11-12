class Room {
    constructor (roomId, title, namespace, privateRoom = false) {
        this.roomId = roomId
        this.title = title
        this.namespace = namespace
        this.privateRoom = privateRoom
        this.history = []
    };

    addMessage (message) {
        this.history.push(message)
    }

    clearHistory () {
        this.history = []
    }

}

module.exports = Room;