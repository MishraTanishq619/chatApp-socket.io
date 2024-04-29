const socket = io();

console.log(socket);

const messageContainer = document.getElementById("messageContainer");

const totalClients = document.getElementById("totalClients");

const messageContainerMain = document.getElementById("messageContainerMain");
function scrollToBottom() {
	// messageContainer.scrollTo(0, messageContainer.scrollHeight);
	messageContainerMain.scrollTop = messageContainerMain.scrollHeight;
}

function mess1(data) {
	let message1 = document.createElement("div");
	message1.innerHTML = `<div
class="message-right flex justify-end p-2 border-2 border-black"
>
<div class="bg-blue-400">
    <div class="text-black m-2">${data.message}</div>
    <div class="flex gap-3 italic m-2">
        <span>${data.sender}</span><span>${moment(data.time).fromNow()}</span>
    </div>
</div>
</div>
</div>
`;
	messageContainer.appendChild(message1);
	scrollToBottom();
	clearFeedback();
}

function mess2(data) {
	let message2 = document.createElement("div");
	message2.innerHTML = `<div
    class="message-left flex justify-start p-2 border-2 border-black"
>
    <div class="bg-gray-400">
        <div class="text-black m-2">${data.message}</div>
        <div class="flex gap-3 italic m-2">
            <span>${data.sender}</span><span>${moment(
		data.time
	).fromNow()}</span>
        </div>
    </div>
</div>`;
	messageContainer.appendChild(message2);
	scrollToBottom();
	clearFeedback();
}

setTimeout(() => {
	console.log(socket.id);
	// totalClients.innerText = 0;
}, 500);

socket.on("clients-total", (data) => {
	console.log(data);
	totalClients.innerText = data;
});

const chatInput = document.getElementById("chatInput");
const sender = document.getElementById("sender");
const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	if (chatInput.value === "") return;
	const message = chatInput.value;
	console.log(message);
	chatInput.value = "";
	let data = {
		message: message,
		sender: sender.value,
		time: new Date(),
	};
	socket.emit("userMessage", data);
	mess1(data);
});

socket.on("serverMessage", (data) => {
	// console.log("server data : ", data);
	mess2(data);
});

const feedback = document.getElementById("feedback");

chatInput.addEventListener("focus", () => {
	console.log("first");
	if (chatInput.value == "") {
		socket.emit("feedback", ``);
	} else {
		socket.emit("feedback", `${sender.value} is typing...`);
	}
});

chatInput.addEventListener("keypress", (e) => {
	// console.log(e.keyCode === 8);
	console.log("first");
	if (chatInput.value == "") {
		socket.emit("feedback", ``);
	} else {
		socket.emit("feedback", `${sender.value} is typing...`);
	}
});

chatInput.addEventListener("blur", () => {
	console.log("first");
	socket.emit("feedback", ``);
});

socket.on("feedback", (data) => {
	feedback.innerText = data;
});

function clearFeedback() {
	feedback.innerText = ``;
}
