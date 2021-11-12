//create end point sockets
const socket = io("http://localhost:9000/");
let nsSocket;
const username = prompt("dakhal smaytk lay haaaaaafdk o 3ich lia l7ayat fchat");
// select elements from the dom
const namespacesDiv = document.querySelector(".namespaces");
socket.on("nsList", (nsData) => {
    
    namespacesDiv.innerHTML = "";
    nsData.forEach(item => {
        namespacesDiv.innerHTML += `
            <div class="namespace" ns="${item.endpoint}">
                <img src="${item.img}" >
            </div>
        `
    });

    // add a click listener for each name space
    const nameSpaces = document.querySelectorAll(".namespace");
    nameSpaces.forEach(elem => {
        elem.addEventListener("click", (e) => {
            const nsEndpoint = elem.getAttribute("ns")
            joinNs(nsEndpoint);
        })
    });
});
