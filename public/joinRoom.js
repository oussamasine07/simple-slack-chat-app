const joinRoom = (roomName) => {
    nsSocket.emit("joinRoom", roomName)
    // display the number of user in the room 
    nsSocket.on("numberOfUsers", (numberOfUsers) => {
        document.querySelector(".curr-room-num-users").innerHTML = `${numberOfUsers} users <span class="glyphicon glyphicon-user"></span>`;
    });
    // get the room info and display it to user 
    nsSocket.on("getHistory", (roomObj) => {
        // update the header of the room 
        document.querySelector(".curr-room-text").innerText = roomObj.roomTitle;
        messagesElem = document.getElementById("messages");
        messagesElem.innerHTML = "";
        roomObj.history.forEach(item => {
            const li = buildHTML(item);
            messagesElem.appendChild(li);
        }); 
    });
}