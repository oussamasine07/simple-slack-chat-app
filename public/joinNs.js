const joinNs = (endpoint) => {
    // join a namespace
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on("nsRoomload", (nsRooms) => {
        
        // console.log(console.log(msg))
        let roomList = document.querySelector(".room-list");
        roomList.innerHTML = "";
        nsRooms.forEach(room => {
            const glyph = room.privateRoom ? "lock" : "globe"
            roomList.innerHTML += `
                <li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.title} </li>
            `;
        });

        // add the event listener for each item in the list
        const rooms = document.querySelectorAll(".room");
        rooms.forEach(room => {
            room.addEventListener("click", (e) => {
                joinRoom(e.target.innerText);
            })
        });

        // add functionality to send a message
        const messageForm = document.getElementById("user-input");
        const messageText = document.getElementById("user-message");

        messageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (messageText.value !== "") {
                nsSocket.emit("newMessageToServer", { username, text: messageText.value })
                messageText.value = "";
            }
        })

        // listen for the messageToClient event
        nsSocket.on("messageToClient", (msgs) => {
            // select the dom elem where to insert the message
            let messagesElem = document.getElementById("messages")
            let li;
            messagesElem.innerHTML = "";
            msgs.forEach(item => {
                li = buildHTML(item);
                messagesElem.appendChild(li);
            });
            
        });

    });

    
}

let buildHTML = (msg) => {
    const time = new Date(msg.time).toLocaleString();
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="user-image">
            <img src="https://via.placeholder.com/30" />
        </div>
        <div class="user-message">
            <div class="user-name-time"> ${msg.username} <span>${time}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    `;
    return li;
}