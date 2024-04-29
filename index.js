const circularParser = require("socket.io-circular-parser");

// const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
	console.log("ChatApp Backend is running at : " + port)
);

const socketsConnected = new Set();
const io = require("socket.io")(server);

// const server = http.createServer(app);

// const { Server } = require("socket.io");
// const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const onConnect = (socket) => {
	console.log(socket.id);
	socketsConnected.add(socket.id);

	io.emit("clients-total", socketsConnected.size);

	socket.on("userMessage", (data) => {
		// console.log("usermessage :", data);

		socket.broadcast.emit("serverMessage", data);
	});

	socket.on("feedback", (data) => {
		console.log("feedback : ", data);
		socket.broadcast.emit("feedback", data);
	});

	socket.on("disconnect", () => {
		console.log(socket.id);
		socketsConnected.delete(socket.id);
		io.emit("clients-total", socketsConnected.size);
	});
};

io.on("connection", onConnect);
