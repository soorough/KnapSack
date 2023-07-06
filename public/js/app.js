const textarea = document.getElementById("textarea");
const subbtn = document.getElementById("submit-btn");
const msgbox = document.getElementById("message-box");
const username = document.getElementById("hidden-input-user").value;
const cls = document.getElementById("hidden-input-cls").value;

let socket = io();

const appendToDom = (data) => {
    const lTag = document.createElement("li");

    lTag.classList.add("message");

    let markup = `<div class="msg-card">
                                <div class="msg-card-body">
                                    <h6>${data.username}</h6>
                                    <p>${data.message}</p>
                                    <div class="msg-card-body-lower">
                                        <img class="icon-image-2" src="/assets/clock-regular.svg" alt="">
                                        <small>${moment(data.time).format(
                                            "LT"
                                        )}</small>
                                    </div>
                                </div>
                            </div>`;

    lTag.innerHTML = markup;

    msgbox.prepend(lTag);
};

const broadcastMessage = (data) => {
    socket.emit("message", data);
};

const postMessage = (message, username) => {
    // append comment in the dom
    // broadcast
    // sync with mongodb

    let data = {
        username: username,
        message: message,
    };

    appendToDom(data);

    textarea.value = "";

    // broadcast
    broadcastMessage(data);

    // sync with mongodb
    data.clsid = cls;
    syncWithDb(data);
};

subbtn.addEventListener("click", (e) => {
    e.preventDefault();

    let message = textarea.value;

    if (!message) {
        return;
    }

    postMessage(message, username);
});

socket.on("message", (data) => {
    appendToDom(data);
});

textarea.addEventListener("keyup", (e) => {
    socket.emit("typing", { username });
});

let timerId = null;
function debounce(func, timer) {
    // clear the previous timer and over write it with the new timer
    if (timerId) {
        clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
        func();
    }, timer)
}

let typingdiv = document.querySelector(".typing");
socket.on("typing", (data) => {
    typingdiv.innerText = `${data.username} is typing...`;
    
    // this means when this typing event stops coming
    // after 1 second run this function
    debounce(function() {
        typingdiv.innerText = "";
    }, 1000);
});

function syncWithDb(data) {
    fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json"}
    }).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
    });
}